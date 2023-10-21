import { z } from "zod";
import { createTRPCRouter, rateLimitedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import axios from "axios";
import { IDailyForecast, IHourlyForecast } from "~/types";
import { log } from "next-axiom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Zod schemas provide runtime data validation ensuring type safety,
 * filling the gap TypeScript static analysis can't cover.
 */

const HourlyWeatherSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number(),
  utc_offset_seconds: z.number(),
  timezone: z.string(),
  timezone_abbreviation: z.string(),
  elevation: z.number(),
  hourly_units: z.object({
    time: z.string(),
    temperature_2m: z.string(),
    rain: z.string(),
    showers: z.string(),
    snowfall: z.string(),
    precipitation_probability: z.string(),
    cloudcover: z.string(),
    windspeed_10m: z.string(),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    rain: z.array(z.number()),
    showers: z.array(z.number()),
    snowfall: z.array(z.number()),
    precipitation_probability: z.array(z.number()),
    cloudcover: z.array(z.number()),
    windspeed_10m: z.array(z.number()),
  }),
});

type HourlyWeather = z.infer<typeof HourlyWeatherSchema> | undefined;

const PresentWeatherSchema = z.object({
  coord: z.object({
    lon: z.number(),
    lat: z.number(),
  }),
  weather: z.array(
    z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    }),
  ),
  base: z.string(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  // Visibility, meter. The maximum value of the visibility is 10 km
  visibility: z.number(),
  wind: z.object({
    speed: z.number(),
    deg: z.number(),
  }),
  clouds: z.object({
    all: z.number(),
  }),
  dt: z.number(),
  sys: z.object({
    sunrise: z.number(),
    sunset: z.number(),
  }),
  timezone: z.number(),
  id: z.number(),
  name: z.string(),
  cod: z.number(),
});

type PresentWeather = z.infer<typeof PresentWeatherSchema> | undefined;

const PresentAirQualitySchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number(),
  utc_offset_seconds: z.number(),
  timezone: z.string(),
  timezone_abbreviation: z.string(),
  hourly_units: z.object({
    time: z.string(),
    pm10: z.string(),
    pm2_5: z.string(),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    pm10: z.array(z.number()),
    pm2_5: z.array(z.number()),
    nitrogen_dioxide: z.array(z.number()),
  }),
});

type PresentAirQuality = z.infer<typeof PresentAirQualitySchema> | undefined;

/**
 * Calculates the Air Quality Index (AQI) based on the given PM10 and PM2.5 values.
 *
 * @param {number} pm10 - The PM10 value in micrograms per cubic meter (µg/m³).
 * @param {number} pm25 - The PM2.5 value in micrograms per cubic meter (µg/m³).
 * @param {number} nitrogenDioxide - The nitrogen dioxide value in micrograms per cubic meter (µg/m³).
 *
 * @return {number} The calculated Air Quality Index (AQI) between 0 and 100.
 */
function calculateAirQualityIndex(
  pm10: number,
  pm25: number,
  nitrogenDioxide: number,
): number {
  // log.debug("start running calculateAirQualityIndex");
  const maxPm10Value = 100;
  const maxPm25Value = 71;
  const maxNitrogenDioxideValue = 601;

  const aqiPm10: number =
    pm10 <= maxPm10Value ? (pm10 / maxPm10Value) * 100 : 100;
  const aqiPm25: number =
    pm25 <= maxPm25Value ? (pm25 / maxPm25Value) * 100 : 100;
  const aqiNitrogenDioxide: number =
    nitrogenDioxide <= maxNitrogenDioxideValue
      ? (nitrogenDioxide / maxNitrogenDioxideValue) * 100
      : 100;

  // log.debug("aqiPm10", { aqiPm10 });
  // log.debug("aqiPm25", { aqiPm25 });
  // log.debug("aqiNitrogenDioxide", { aqiNitrogenDioxide });
  return Math.max(aqiPm10, aqiPm25, aqiNitrogenDioxide);
}

export const weatherRouter = createTRPCRouter({
  getWeather: rateLimitedProcedure
    .input(
      z.object({
        coordinates: z.object({
          lat: z.number().min(-90).max(90),
          lon: z.number().min(-180).max(180),
        }),
        timezone: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      log.info("User requested weather data for coordinates", {
        coordinates: input.coordinates,
        timezone: input.timezone,
        user: ctx.ip,
      });
      // OpenWeatherMap API
      const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${input.coordinates.lat}&lon=${input.coordinates.lon}&appid=${env.OPEN_WEATHER_API_KEY}`;
      // Open Meteo
      const urlHourlyForecast = `https://api.open-meteo.com/v1/forecast?latitude=${input.coordinates.lat}&longitude=${input.coordinates.lon}&hourly=temperature_2m,rain,showers,snowfall,precipitation_probability,cloudcover,windspeed_10m&forecast_days=9&timezone=${input.timezone}`;
      const urlAirQuality = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${input.coordinates.lat}&longitude=${input.coordinates.lon}&hourly=pm10,pm2_5,nitrogen_dioxide`;

      let [hourlyResult, presentWeatherResult, presentAirQualityResult] =
        await Promise.allSettled([
          axios.get<HourlyWeather>(urlHourlyForecast),
          axios.get<PresentWeather>(urlWeather),
          axios.get<PresentAirQuality>(urlAirQuality),
        ]);

      let hourlyData: HourlyWeather = undefined;
      let presentWeather: PresentWeather = undefined;
      let presentAirQuality: PresentAirQuality = undefined;

      if (hourlyResult.status === "fulfilled") {
        try {
          let data = hourlyResult.value.data;

          if (!data) {
            throw new Error("Air quality data is undefined");
          }

          // log.debug("Hourly data without the filter and unparsed", data);

          data.hourly.precipitation_probability =
            data.hourly.precipitation_probability.filter(
              (value) => value !== null,
            );

          hourlyData = HourlyWeatherSchema.parse(data);
          // log.debug("Parsed and filtered hourly data", hourlyData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            log.error("Zod Errors in the hourly weather", error.issues);
          } else {
            log.error("Else Error in the hourly weather", { error });
          }
        }
      } else {
        log.error("Hourly weather data request failed", {
          status: hourlyResult.status,
          reason: hourlyResult.reason,
        });
      }

      if (presentWeatherResult.status === "fulfilled") {
        try {
          presentWeather = PresentWeatherSchema.parse(
            presentWeatherResult.value.data,
          );
        } catch (error) {
          if (error instanceof z.ZodError) {
            log.error("Zod Errors in the present weather", error.issues);
          } else {
            log.error("Else Error in the present weather", { error });
          }
        }
      } else {
        log.error("Present weather data request failed", {
          status: presentWeatherResult.status,
          reason: presentWeatherResult.reason,
        });
      }

      if (presentAirQualityResult.status === "fulfilled") {
        try {
          let data = presentAirQualityResult.value.data;

          if (!data) {
            throw new Error("Air quality data is undefined");
          }

          // log.debug("Air quality data without the filter and unparsed", data);

          data.hourly.pm10 = data.hourly.pm10.filter((value) => value !== null);
          data.hourly.pm2_5 = data.hourly.pm2_5.filter(
            (value) => value !== null,
          );
          data.hourly.nitrogen_dioxide = data.hourly.nitrogen_dioxide.filter(
            (value) => value !== null,
          );

          presentAirQuality = PresentAirQualitySchema.parse(data);
        } catch (error) {
          if (error instanceof z.ZodError) {
            log.error("Zod Errors in the air quality", error.issues);
          } else {
            log.error("Else Error in the air quality", { error });
          }
        }
      } else {
        log.error("Present air quality data request failed", {
          status: presentAirQualityResult.status,
          reason: presentAirQualityResult.reason,
        });
      }

      let presentAirQualityIndex: number | undefined = undefined;

      if (
        presentAirQuality?.hourly.pm10[0] &&
        presentAirQuality?.hourly.pm2_5[0] &&
        presentAirQuality?.hourly.nitrogen_dioxide[0]
      ) {
        presentAirQualityIndex = calculateAirQualityIndex(
          presentAirQuality.hourly.pm10[0],
          presentAirQuality.hourly.pm2_5[0],
          presentAirQuality.hourly.nitrogen_dioxide[0],
        );
      }

      const hourlyForecast: IHourlyForecast[] = [];

      const currentHour = dayjs().tz(input.timezone).hour();
      for (let i = currentHour; i < currentHour + 15; i++) {
        const temperature = hourlyData?.hourly.temperature_2m[i];
        const rain = hourlyData?.hourly.rain[i];
        const showers = hourlyData?.hourly.showers[i];
        const snowfall = hourlyData?.hourly.snowfall[i];
        const cloudcover = hourlyData?.hourly.cloudcover[i];
        const windSpeed = hourlyData?.hourly.windspeed_10m[i];
        // console.log(cloudcover);

        const time = i % 24;

        hourlyForecast.push({
          time,
          temperature: temperature ? temperature + 273.15 : undefined,
          rain,
          showers,
          snowfall,
          cloudcover,
          windSpeed,
        });
      }

      const dailyForecast: IDailyForecast[] = [];

      if (hourlyData) {
        for (let i = 0; i < 9; i++) {
          // console.log("i", i);
          let temperatureSumDay = 0;
          let temperatureSumNight = 0;
          let rainSum = 0;
          let showersSum = 0;
          let snowfallSum = 0;
          let cloudcoverSum = 0;
          let windSpeedSum = 0;

          let temperatureCountDay = 0;
          let temperatureCountNight = 0;
          let rainCount = 0;
          let showersCount = 0;
          let snowfallCount = 0;
          let cloudcoverCount = 0;
          let windSpeedCount = 0;

          for (let j = 24 * i; j < 24 * (i + 1); j++) {
            // console.log("j", j);
            if (hourlyData.hourly.temperature_2m[j] !== undefined) {
              if (j % 24 > 6 && j % 24 < 19) {
                temperatureSumDay += hourlyData.hourly.temperature_2m[j]!;
                // console.log("j", j);
                temperatureCountDay++;
                // console.log(hourlyData.hourly.temperature_2m[j]!);
                // console.log("temperatureSumDay", temperatureSumDay);
              } else {
                temperatureSumNight += hourlyData.hourly.temperature_2m[j]!;
                // console.log("j", j);
                temperatureCountNight++;
                // console.log(hourlyData.hourly.temperature_2m[j]!);
                // console.log("temperatureSumNight", temperatureSumNight);
              }
            } else {
              console.log("undefined value temperature: ", j);
            }

            if (hourlyData.hourly.rain[j] !== undefined) {
              rainSum += hourlyData.hourly.rain[j]!;
              rainCount++;
              // console.log(hourlyData.hourly.rain[j]!);
              // console.log("rainSum", rainSum);
            } else {
              console.log("undefined value rain: ", j);
            }

            if (hourlyData.hourly.showers[j] !== undefined) {
              showersSum += hourlyData.hourly.showers[j]!;
              showersCount++;
              // console.log(hourlyData.hourly.showers[j]!);
              // console.log("showersSum", showersSum);
            } else {
              console.log("undefined value showers: ", j);
            }

            if (hourlyData.hourly.snowfall[j] !== undefined) {
              snowfallSum += hourlyData.hourly.snowfall[j]!;
              snowfallCount++;
              // console.log(hourlyData.hourly.snowfall[j]!);
              // console.log("snowfallSum", snowfallSum);
            } else {
              console.log("undefined value snowfall: ", j);
            }

            if (hourlyData.hourly.cloudcover[j] !== undefined) {
              cloudcoverSum += hourlyData.hourly.cloudcover[j]!;
              cloudcoverCount++;
              // console.log(hourlyData.hourly.cloudcover[j]!);
              // console.log("cloudcoverSum", cloudcoverSum);
            }

            if (hourlyData.hourly.windspeed_10m[j] !== undefined) {
              windSpeedSum += hourlyData.hourly.windspeed_10m[j]!;
              windSpeedCount++;
              // console.log(hourlyData.hourly.cloudcover[j]!);
              // console.log("cloudcoverSum", cloudcoverSum);
            }
          }

          /*
            console.log("temperatureSum", temperatureSum);
            console.log("temperatureCount", temperatureCount);
            console.log("rainSum", rainSum);
            console.log("rainCount", rainCount);
            console.log("showersSum", showersSum);
            console.log("showersCount", showersCount);
            console.log("snowfallSum", snowfallSum);
            console.log("snowfallCount", snowfallCount);
            */

          const temperatureAverageDay =
            temperatureSumDay / (temperatureCountDay || 1);
          const temperatureAverageNight =
            temperatureSumNight / (temperatureCountNight || 1);
          const rainAverage = rainSum / (rainCount || 1);
          const showersAverage = showersSum / (showersCount || 1);
          const snowfallAverage = snowfallSum / (snowfallCount || 1);
          const cloudcoverAverage = cloudcoverSum / (cloudcoverCount || 1);
          const windSpeedAverage = windSpeedSum / (windSpeedCount || 1);

          /*
            console.log("temperatureAverageDay", temperatureAverageDay);
            console.log("temperatureAverageNight", temperatureAverageNight);
            console.log("rainAverage", rainAverage);
            console.log("showersAverage", showersAverage);
            console.log("snowfallAverage", snowfallAverage);
            */

          dailyForecast.push({
            date: new Date(new Date().setDate(new Date().getDate() + i)),
            temperatureDay: temperatureCountDay
              ? temperatureAverageDay + 273.15
              : undefined,
            temperatureNight: temperatureCountNight
              ? temperatureAverageNight + 273.15
              : undefined,
            rain: rainCount ? rainAverage : undefined,
            showers: showersCount ? showersAverage : undefined,
            snowfall: snowfallCount ? snowfallAverage : undefined,
            cloudcover: cloudcoverCount ? cloudcoverAverage : undefined,
            windSpeed: windSpeedCount ? windSpeedAverage : undefined,
          });
        }
      }

      interface HourlyPrecipitationData {
        hourly: {
          precipitation_probability: number[];
        };
      }

      const precipitationProbabilities: Record<string, number | undefined> = {};

      /**
       * Calculates the average precipitation probability for a given time slot.
       *
       * @param {number} startIndex - The start index of the time slot.
       * @param {number} endIndex - The end index of the time slot.
       * @param {HourlyPrecipitationData|undefined} data - The hourly precipitation data.
       * @returns {number|undefined} - The average precipitation probability for the time slot, or undefined if the data is unavailable.
       */
      const getTimeSlotAverage = (
        startIndex: number,
        endIndex: number,
        data: HourlyPrecipitationData | undefined,
      ): number | undefined => {
        const probabilities = data?.hourly.precipitation_probability ?? [];

        if (
          probabilities[startIndex] !== undefined &&
          probabilities[endIndex] !== undefined
        ) {
          return (probabilities[startIndex]! + probabilities[endIndex]!) / 2;
        }

        return undefined;
      };

      const timeSlots: { slot: string; start: number; end: number }[] = [
        { slot: "1 early morning", start: 0, end: 5 },
        { slot: "2 morning", start: 6, end: 9 },
        { slot: "3 noon", start: 10, end: 14 },
        { slot: "4 afternoon", start: 15, end: 19 },
        { slot: "5 night", start: 20, end: 23 },
      ];

      timeSlots.forEach(({ slot, start, end }) => {
        precipitationProbabilities[slot] = getTimeSlotAverage(
          start,
          end,
          hourlyData,
        );
      });

      return {
        time: {
          time: dayjs().tz(input.timezone).format(),
          timezone: input.timezone,
        },
        // Present weather in Kelvin NOT daily average
        temperature: presentWeather?.main.temp,
        // In Kelvin
        highestTemperature:
          Math.max(...(hourlyData?.hourly.temperature_2m.slice(0, 23) ?? [])) +
          273.15,
        // In Kelvin
        minimumTemperature:
          Math.min(...(hourlyData?.hourly.temperature_2m.slice(0, 23) ?? [])) +
          273.15,
        // Present weather in Kelvin
        feels_like: presentWeather?.main.feels_like,
        // In meters per second
        wind_speed: presentWeather?.wind.speed,
        // Calculates the wind pressure in Pa
        wind_pressure: presentWeather?.wind.speed
          ? 0.5 * 1.225 * Math.pow(presentWeather.wind.speed, 2)
          : undefined,
        // Index from 0 to 100
        air_quality: presentAirQualityIndex,
        // In percentages
        visibility: presentWeather
          ? presentWeather.visibility / 100
          : undefined,
        // In percentages
        precipitationProbabilities: hourlyData
          ? precipitationProbabilities
          : undefined,
        hourlyForecast,
        dailyForecast,
        // In percentages
        cloudcover: hourlyForecast[0]?.cloudcover,
        // Dayjs timestamp
        sunrise: dayjs
          .unix(presentWeather?.sys.sunrise ?? 0)
          .tz(input.timezone)
          .format(),
        // Dayjs timestamp
        sunset: dayjs
          .unix(presentWeather?.sys.sunset ?? 0)
          .tz(input.timezone)
          .format(),
      };
    }),
});
