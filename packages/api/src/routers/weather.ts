import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { log } from "next-axiom";
import { z } from "zod";

import type { IDailyForecast, IHourlyForecast } from "@weatherio/types";

import { env } from "../../env.mjs";
import { createTRPCRouter, rateLimitedProcedure } from "../trpc";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Zod schemas provide runtime data validation ensuring type safety,
 * filling the gap TypeScript static analysis can't cover.
 */

const HourlyAndDailyWeatherSchema = z.object({
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
    apparent_temperature: z.array(z.number()),
    rain: z.array(z.number()),
    showers: z.array(z.number()),
    snowfall: z.array(z.number()),
    precipitation_probability: z.array(z.number()),
    cloudcover: z.array(z.number()),
    windspeed_10m: z.array(z.number()),
  }),
  daily: z.object({
    sunshine_duration: z.array(z.number()),
    uv_index_max: z.array(z.number()),
  }),
});

type HourlyAndDailyWeather =
  | z.infer<typeof HourlyAndDailyWeatherSchema>
  | undefined;

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
    pm10: z.array(z.number().nullable()),
    pm2_5: z.array(z.number().nullable()),
    nitrogen_dioxide: z.array(z.number().nullable()),
  }),
});

type PresentAirQuality = z.infer<typeof PresentAirQualitySchema> | undefined;

const MoonPhaseSchema = z.object({
  moonrise: z.string(),
  moonset: z.string(),
  moonPhase: z.array(z.object({ icon: z.string() })),
});

type MoonPhase = z.infer<typeof MoonPhaseSchema> | undefined;

const WarningSchema = z.object({
  warning: z
    .array(
      z.object({
        sender: z.string(),
        pubTime: z.string(),
        title: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        status: z.string(),
        level: z.string(),
        severity: z.string(),
        urgency: z.string(),
        certainty: z.string(),
        text: z.string(),
      }),
    )
    .optional(),
});

type Warning = z.infer<typeof WarningSchema> | undefined;

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
        lang: z.union([z.string(), z.undefined()] as const),
      }),
    )
    .query(async ({ input, ctx }) => {
      log.info("User requested weather data for coordinates", {
        coordinates: input.coordinates,
        timezone: input.timezone,
        user: ctx.ip,
      });
      const lang = input.lang ? input.lang : "en";
      // OpenWeatherMap API
      const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${input.coordinates.lat}&lon=${input.coordinates.lon}&appid=${env.OPEN_WEATHER_API_KEY}`;
      // Open Meteo
      const urlHourlyAndDailyForecast = `https://api.open-meteo.com/v1/forecast?latitude=${input.coordinates.lat}&longitude=${input.coordinates.lon}&hourly=temperature_2m,rain,showers,snowfall,precipitation_probability,cloudcover,windspeed_10m,apparent_temperature&forecast_days=9&timezone=${input.timezone}&daily=sunshine_duration,uv_index_max`;
      const urlAirQuality = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${input.coordinates.lat}&longitude=${input.coordinates.lon}&hourly=pm10,pm2_5,nitrogen_dioxide`;
      // QWeather
      const urlMoonPhase = `https://devapi.qweather.com/v7/astronomy/moon?location=${input.coordinates.lon.toFixed(
        2,
      )},${input.coordinates.lat.toFixed(2)}&key=${
        env.QWEATHER_API_KEY
      }&date=${dayjs().tz("Asia/Shanghai").format("YYYYMMDD")}`;
      const urlWarning = `https://devapi.qweather.com/v7/warning/now?location=${input.coordinates.lon.toFixed(
        2,
      )},${input.coordinates.lat.toFixed(2)}&key=${
        env.QWEATHER_API_KEY
      }&lang=${lang}`;

      const [
        hourlyResult,
        presentWeatherResult,
        presentAirQualityResult,
        moonPhaseResult,
        warningResult,
      ] = await Promise.allSettled([
        fetch(urlHourlyAndDailyForecast),
        fetch(urlWeather),
        fetch(urlAirQuality),
        fetch(urlMoonPhase),
        fetch(urlWarning),
      ]);

      let hourlyAndDailyData: HourlyAndDailyWeather = undefined;
      let presentWeather: PresentWeather = undefined;
      let presentAirQuality: PresentAirQuality = undefined;
      let moonPhase: MoonPhase = undefined;
      let warning: Warning = undefined;

      async function handleApiResponse<DataSchema>(
        result: PromiseSettledResult<Response>,
        schema: z.ZodSchema<DataSchema>,
        errorMessage: string,
        filterFn?: (data: DataSchema) => DataSchema,
      ): Promise<DataSchema | undefined> {
        let parsedData: DataSchema | undefined = undefined;

        if (result.status === "fulfilled") {
          try {
            const data = await result.value.json();

            parsedData = schema.parse(data);

            if (!parsedData) {
              throw new Error(`The ${errorMessage} data is undefined`);
            }

            // Apply the filter function if it is provided
            if (filterFn) {
              parsedData = filterFn(parsedData);
            }
          } catch (error) {
            if (error instanceof z.ZodError) {
              log.error(`Zod Errors in the ${errorMessage}`, error.issues);
            } else {
              log.error(`Else Error in the ${errorMessage}`, { error });
            }
          }
        } else {
          console.log("result", result);
          log.error(`${errorMessage} request failed`, {
            status: result.status,
            reason:
              typeof result.reason === "string"
                ? result.reason
                : "The reason is not a string",
          });
        }

        return parsedData;
      }

      hourlyAndDailyData = await handleApiResponse<HourlyAndDailyWeather>(
        hourlyResult,
        HourlyAndDailyWeatherSchema,
        "hourly weather",
      );

      presentWeather = await handleApiResponse<PresentWeather>(
        presentWeatherResult,
        PresentWeatherSchema,
        "present weather",
      );

      presentAirQuality = await handleApiResponse<PresentAirQuality>(
        presentAirQualityResult,
        PresentAirQualitySchema,
        "present air quality",
      );

      moonPhase = await handleApiResponse<MoonPhase>(
        moonPhaseResult,
        MoonPhaseSchema,
        "moon phase",
      );

      warning = await handleApiResponse<Warning>(
        warningResult,
        WarningSchema,
        "warning",
      );

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

      // log.debug("presentAirQualityIndex", { presentAirQualityIndex });

      const hourlyForecast: IHourlyForecast[] = [];

      const currentHour = dayjs().tz(input.timezone).hour();
      for (let i = currentHour; i < currentHour + 15; i++) {
        const temperature = hourlyAndDailyData?.hourly.temperature_2m[i];
        const apparentTemperature =
          hourlyAndDailyData?.hourly.apparent_temperature[i];
        const rain = hourlyAndDailyData?.hourly.rain[i];
        const showers = hourlyAndDailyData?.hourly.showers[i];
        const snowfall = hourlyAndDailyData?.hourly.snowfall[i];
        const cloudcover = hourlyAndDailyData?.hourly.cloudcover[i];
        const windSpeed = hourlyAndDailyData?.hourly.windspeed_10m[i];
        // console.log(cloudcover);

        const time = i % 24;

        hourlyForecast.push({
          time,
          temperature:
            temperature !== undefined ? temperature + 273.15 : undefined,
          apparentTemperature:
            apparentTemperature !== undefined
              ? apparentTemperature + 273.15
              : undefined,
          rain,
          showers,
          snowfall,
          cloudcover,
          windSpeed,
        });
      }

      const dailyForecast: IDailyForecast[] = [];

      if (hourlyAndDailyData) {
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
            if (hourlyAndDailyData.hourly.temperature_2m[j] !== undefined) {
              if (j % 24 > 6 && j % 24 < 19) {
                temperatureSumDay +=
                  hourlyAndDailyData.hourly.temperature_2m[j]!;
                // console.log("j", j);
                temperatureCountDay++;
                // console.log(hourlyAndDailyData.hourly.temperature_2m[j]!);
                // console.log("temperatureSumDay", temperatureSumDay);
              } else {
                temperatureSumNight +=
                  hourlyAndDailyData.hourly.temperature_2m[j]!;
                // console.log("j", j);
                temperatureCountNight++;
                // console.log(hourlyAndDailyData.hourly.temperature_2m[j]!);
                // console.log("temperatureSumNight", temperatureSumNight);
              }
            } else {
              console.log("undefined value temperature: ", j);
            }

            if (hourlyAndDailyData.hourly.rain[j] !== undefined) {
              rainSum += hourlyAndDailyData.hourly.rain[j]!;
              rainCount++;
              // console.log(hourlyAndDailyData.hourly.rain[j]!);
              // console.log("rainSum", rainSum);
            } else {
              console.log("undefined value rain: ", j);
            }

            if (hourlyAndDailyData.hourly.showers[j] !== undefined) {
              showersSum += hourlyAndDailyData.hourly.showers[j]!;
              showersCount++;
              // console.log(hourlyAndDailyData.hourly.showers[j]!);
              // console.log("showersSum", showersSum);
            } else {
              console.log("undefined value showers: ", j);
            }

            if (hourlyAndDailyData.hourly.snowfall[j] !== undefined) {
              snowfallSum += hourlyAndDailyData.hourly.snowfall[j]!;
              snowfallCount++;
              // console.log(hourlyAndDailyData.hourly.snowfall[j]!);
              // console.log("snowfallSum", snowfallSum);
            } else {
              console.log("undefined value snowfall: ", j);
            }

            if (hourlyAndDailyData.hourly.cloudcover[j] !== undefined) {
              cloudcoverSum += hourlyAndDailyData.hourly.cloudcover[j]!;
              cloudcoverCount++;
              // console.log(hourlyAndDailyData.hourly.cloudcover[j]!);
              // console.log("cloudcoverSum", cloudcoverSum);
            }

            if (hourlyAndDailyData.hourly.windspeed_10m[j] !== undefined) {
              windSpeedSum += hourlyAndDailyData.hourly.windspeed_10m[j]!;
              windSpeedCount++;
              // console.log(hourlyAndDailyData.hourly.cloudcover[j]!);
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

        /* log.debug("getTimeSlotAverage", {
          startIndex,
          endIndex,
          probabilities,
        }); */

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
          hourlyAndDailyData,
        );
      });

      const temperature = presentWeather?.main.temp
        ? presentWeather?.main.temp
        : hourlyForecast[0]?.temperature;

      // For testing purposes
      // await new Promise((resolve) => setTimeout(resolve, 100000));

      return {
        time: {
          time: dayjs().tz(input.timezone).format(),
          timezone: input.timezone,
        },
        // Present weather in Kelvin NOT daily average
        temperature: temperature,
        // This complex code is there for the case that if the temperature is over the maximum, it gets the temperature.
        // **In Kelvin.**
        highestTemperature: temperature
          ? Math.max(
              ...(hourlyAndDailyData?.hourly.temperature_2m.slice(0, 23) ?? []),
            ) +
              273.15 >
            temperature
            ? Math.max(
                ...(hourlyAndDailyData?.hourly.temperature_2m.slice(0, 23) ??
                  []),
              ) + 273.15
            : temperature
          : Math.max(
              ...(hourlyAndDailyData?.hourly.temperature_2m.slice(0, 23) ?? []),
            ) + 273.15,
        // This complex code is there for the case that if the temperature is under the minimum,
        // it gets the temperature.
        // **In Kelvin.**
        minimumTemperature: temperature
          ? Math.min(
              ...(hourlyAndDailyData?.hourly.temperature_2m.slice(0, 23) ?? []),
            ) +
              273.15 <
            temperature
            ? Math.min(
                ...(hourlyAndDailyData?.hourly.temperature_2m.slice(0, 23) ??
                  []),
              ) + 273.15
            : temperature
          : Math.min(
              ...(hourlyAndDailyData?.hourly.temperature_2m.slice(0, 23) ?? []),
            ) + 273.15,
        // Present weather in Kelvin
        feels_like: presentWeather?.main.feels_like
          ? presentWeather?.main.feels_like
          : hourlyForecast[0]?.apparentTemperature,
        // In meters per second
        wind_speed: presentWeather?.wind.speed,
        // Calculates the wind pressure in hPa
        wind_pressure:
          presentWeather?.main.pressure !== undefined
            ? presentWeather?.main.pressure
            : undefined,
        // Index from 0 to 100
        air_quality: presentAirQualityIndex,
        // In percentages
        visibility: presentWeather
          ? presentWeather.visibility / 100
          : undefined,
        // In percentages
        precipitationProbabilities: hourlyAndDailyData
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
        moonrise: moonPhase
          ? dayjs(moonPhase.moonrise).tz(input.timezone).format()
          : undefined,
        moonset: moonPhase
          ? dayjs(moonPhase.moonset).tz(input.timezone).format()
          : undefined,
        moonPhaseCode: moonPhase?.moonPhase[0]?.icon,
        sunHours:
          hourlyAndDailyData?.daily.sunshine_duration[0] !== undefined
            ? (hourlyAndDailyData.daily.sunshine_duration[0] / 3600).toFixed(0)
            : undefined,
        maxUVIndex: hourlyAndDailyData?.daily.uv_index_max[0],
        warnings: warning?.warning,
      };
    }),
});
