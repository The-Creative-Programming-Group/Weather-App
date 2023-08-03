import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  rateLimitedProcedure,
} from "~/server/api/trpc";
import { env } from "~/env.mjs";
import axios from "axios";

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
    cloudcover_700hPa: z.string(),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    rain: z.array(z.number()),
    showers: z.array(z.number()),
    snowfall: z.array(z.number()),
    precipitation_probability: z.array(z.number()),
    cloudcover_700hPa: z.array(z.number()),
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
    sea_level: z.number(),
    grnd_level: z.number(),
  }),
  visibility: z.number(),
  wind: z.object({
    speed: z.number(),
    deg: z.number(),
    gust: z.number(),
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
  }),
});

type PresentAirQuality = z.infer<typeof PresentAirQualitySchema> | undefined;

/**
 * Calculates the Air Quality Index (AQI) based on the given PM10 and PM2.5 values.
 *
 * @param {number} pm10 - The PM10 value in micrograms per cubic meter (µg/m³).
 * @param {number} pm25 - The PM2.5 value in micrograms per cubic meter (µg/m³).
 *
 * @return {number} The calculated Air Quality Index (AQI) between 0 and 100.
 */
function calculateAirQualityIndex(pm10: number, pm25: number): number {
  const scaleFactor = 500.4;

  const aqiPm10 = (pm10 / scaleFactor) * 100;
  const aqiPm25 = (pm25 / scaleFactor) * 100;

  return Math.max(aqiPm10, aqiPm25);
}

export const weatherRouter = createTRPCRouter({
  getWeather: rateLimitedProcedure
    .input(
      z.object({
        coordinates: z.object({
          lat: z.number().min(-90).max(90),
          lon: z.number().min(0).max(180),
        }),
      }),
    )
    .query(async ({ input }) => {
      // OpenWeatherMap API
      const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${input.coordinates.lat}&lon=${input.coordinates.lon}&appid=${env.OPEN_WEATHER_API_KEY}`;
      // Open Meteo
      const urlHourlyForecast = `https://api.open-meteo.com/v1/forecast?latitude=${input.coordinates.lat}&longitude=${input.coordinates.lon}&hourly=temperature_2m,rain,showers,snowfall,precipitation_probability&forecast_days=7&hourly=cloudcover_700hPa`;
      const urlAirQuality = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${input.coordinates.lat}&longitude=${input.coordinates.lon}&hourly=pm10,pm2_5`;

      // Hourly Weather Forecast from Open Meteo
      let hourlyData: HourlyWeather = undefined;

      try {
        const hourlyWeatherData = await axios.get<HourlyWeather>(
          urlHourlyForecast,
        );
        hourlyData = HourlyWeatherSchema.parse(hourlyWeatherData.data);
        console.log(hourlyData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.log("Zod Errors", error.issues);
        } else {
          console.error(error);
        }
      }

      // Present Weather from OpenWeatherMap
      let presentWeather: PresentWeather = undefined;

      try {
        const weatherData = await axios.get<PresentWeather>(urlWeather);
        presentWeather = PresentWeatherSchema.parse(weatherData.data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.log("Zod Errors", error.issues);
        } else {
          console.error(error);
        }
      }

      // Present Air Quality from Open Meteo
      let presentAirQuality: PresentAirQuality = undefined;

      try {
        const airQualityData = await axios.get<PresentAirQuality>(
          urlAirQuality,
        );
        presentAirQuality = PresentAirQualitySchema.parse(airQualityData.data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.log("Zod Errors", error.issues);
        } else {
          console.error(error);
        }
      }

      let presentAirQualityIndex: number | undefined = undefined;

      if (
        presentAirQuality?.hourly.pm10[0] &&
        presentAirQuality?.hourly.pm2_5[0]
      ) {
        presentAirQualityIndex = calculateAirQualityIndex(
          presentAirQuality.hourly.pm10[0],
          presentAirQuality.hourly.pm2_5[0],
        );
      }

      interface IHourlyForecast {
        // Hour of current day
        time: number;
        // In Kelvin
        temperature: number | undefined;
        // In millimeters
        rain: number | undefined;
        // In millimeters
        showers: number | undefined;
        // In centimeters
        snowfall: number | undefined;
        // In percentages
        cloudcover: number | undefined;
      }

      const hourlyForecast: IHourlyForecast[] = [];

      const currentHour = new Date().getUTCHours();
      for (let i = currentHour; i < currentHour + 15; i++) {
        const temperature = hourlyData?.hourly.temperature_2m[i];
        const rain = hourlyData?.hourly.rain[i];
        const showers = hourlyData?.hourly.showers[i];
        const snowfall = hourlyData?.hourly.snowfall[i];
        const cloudcover = hourlyData?.hourly.cloudcover_700hPa[i];
        console.log(cloudcover);

        const j = i % 24;

        hourlyForecast.push({
          time: j,
          temperature: temperature ? temperature + 273.15 : undefined,
          rain: rain,
          showers: showers,
          snowfall: snowfall,
          cloudcover: cloudcover,
        });
      }

      interface IDailyForecast {
        // Day of current week (starts with 0 (current day))
        day: number;
        // In Kelvin day and night
        temperature: number | undefined;
        // In millimeters
        rain: number | undefined;
        // In millimeters
        showers: number | undefined;
        // In centimeters
        snowfall: number | undefined;
        // In percent
        cloudcover: number | undefined;
      }

      const dailyForecast: IDailyForecast[] = [];

      if (hourlyData) {
        for (let i = 0; i < 7; i++) {
          // console.log("i", i);
          let temperatureSum = 0;
          let rainSum = 0;
          let showersSum = 0;
          let snowfallSum = 0;
          let cloudcoverSum = 0;

          let temperatureCount = 0;
          let rainCount = 0;
          let showersCount = 0;
          let snowfallCount = 0;
          let cloudcoverCount = 0;

          for (let j = 24 * i; j < 24 * (i + 1); j++) {
            // console.log("j", j);
            if (hourlyData.hourly.temperature_2m[j] !== undefined) {
              temperatureSum += hourlyData.hourly.temperature_2m[j]!;
              temperatureCount++;
              // console.log(hourlyData.hourly.temperature_2m[j]!);
              // console.log("temperatureSum", temperatureSum);
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

            if (hourlyData.hourly.cloudcover_700hPa[j] !== undefined) {
              cloudcoverSum += hourlyData.hourly.cloudcover_700hPa[j]!;
              cloudcoverCount++;
              // console.log(hourlyData.hourly.cloudcover_700hPa[j]!);
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

          const temperatureAverage = temperatureSum / (temperatureCount || 1);
          const rainAverage = rainSum / (rainCount || 1);
          const showersAverage = showersSum / (showersCount || 1);
          const snowfallAverage = snowfallSum / (snowfallCount || 1);
          const cloudcoverAverage = cloudcoverSum / (cloudcoverCount || 1);

          /*
            console.log("temperatureAverage", temperatureAverage);
            console.log("rainAverage", rainAverage);
            console.log("showersAverage", showersAverage);
            console.log("snowfallAverage", snowfallAverage);
            */

          dailyForecast.push({
            day: i,
            temperature: temperatureCount
              ? temperatureAverage + 273.15
              : undefined,
            rain: rainCount ? rainAverage : undefined,
            showers: showersCount ? showersAverage : undefined,
            snowfall: snowfallCount ? snowfallAverage : undefined,
            cloudcover: cloudcoverCount ? cloudcoverAverage : undefined,
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
        { slot: "2 morning", start: 6, end: 10 },
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
        time: new Date(),
        // Present weather in Kelvin NOT daily average
        temperature: presentWeather?.main.temp,
        feels_like: presentWeather?.main.feels_like,
        // In meters per second
        wind_speed: presentWeather?.wind.speed,
        // Calculates the wind pressure in Pa
        wind_pressure: presentWeather
          ? 0.5 * 1.225 * Math.pow(presentWeather.wind.speed, 2)
          : undefined,
        // Index from 0 to 100
        air_quality: presentAirQualityIndex,
        // In percentages
        visibility: presentWeather
          ? presentWeather.visibility / 100
          : undefined,
        precipitationProbabilities: hourlyData
          ? precipitationProbabilities
          : undefined,
        hourlyForecast,
        dailyForecast,
        // In percentages
        cloudcover: hourlyForecast[0]?.cloudcover,
      };
    }),
});
