import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import axios from "axios";

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
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    rain: z.array(z.number()),
    showers: z.array(z.number()),
    snowfall: z.array(z.number()),
    precipitation_probability: z.array(z.number()),
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
    })
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
    type: z.number(),
    id: z.number(),
    country: z.string(),
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

// !TODO: 0 - 100 instead of 0 - 500
function calculateAirQualityIndex(pm10: number, pm25: number): number {
  const aqiValues = [0, 50, 100, 150, 200, 300, 400, 500];
  const breakpoints = [0, 12, 35.4, 55.4, 150.4, 250.4, 350.4, 500.4];

  function calculateAqiConcentration(pm: number, index: number): number {
    const bpLow = breakpoints[index];
    const bpHigh = breakpoints[index + 1];
    const aqiLow = aqiValues[index];
    const aqiHigh = aqiValues[index + 1];

    if (
      bpLow === undefined ||
      bpHigh === undefined ||
      aqiLow === undefined ||
      aqiHigh === undefined
    ) {
      return 0;
    }

    return ((aqiHigh - aqiLow) / (bpHigh - bpLow)) * (pm - bpLow) + aqiLow;
  }

  const aqiPm10 = calculateAqiConcentration(pm10, 0);
  const aqiPm25 = calculateAqiConcentration(pm25, 1);

  return Math.max(aqiPm10, aqiPm25);
}

export const weatherRouter = createTRPCRouter({
  getWeather: publicProcedure
    .input(
      z.object({
        coordinates: z.object({
          lat: z.number().min(-90).max(90),
          lon: z.number().min(0).max(180),
        }),
      })
    )
    .query(async ({ input }) => {
      // OpenWeatherMap API
      const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${input.coordinates.lat}&lon=${input.coordinates.lon}&appid=${env.OPEN_WEATHER_API_KEY}`;
      // Open Meteo
      const urlHourlyForecast = `https://api.open-meteo.com/v1/forecast?latitude=${input.coordinates.lat}&longitude=${input.coordinates.lon}&hourly=temperature_2m,rain,showers,snowfall,precipitation_probability&forecast_days=10`;
      const urlAirQuality = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${input.coordinates.lat}&longitude=${input.coordinates.lon}&hourly=pm10,pm2_5`;

      // Hourly Weather Forecast from Open Meteo
      let hourlyData: HourlyWeather = undefined;

      try {
        const hourlyWeatherData = await axios.get<HourlyWeather>(
          urlHourlyForecast
        );
        hourlyData = HourlyWeatherSchema.parse(hourlyWeatherData.data);
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
          urlAirQuality
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
          presentAirQuality.hourly.pm2_5[0]
        );
      }

      interface HourlyData {
        hourly: {
          precipitation_probability: number[];
        };
      }

      const precipitationProbabilities: Record<string, number | undefined> = {};

      const getTimeSlotAverage = (
        startIndex: number,
        endIndex: number,
        data: HourlyData | undefined
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

      const timeSlots = [
        { slot: "1 night", start: 0, end: 1 },
        { slot: "2 morning", start: 2, end: 3 },
        { slot: "3 noon", start: 4, end: 4 },
        { slot: "4 afternoon", start: 5, end: 6 },
        { slot: "5 evening", start: 7, end: 8 },
      ];

      timeSlots.forEach(({ slot, start, end }) => {
        precipitationProbabilities[slot] = getTimeSlotAverage(
          start,
          end,
          hourlyData
        );
      });

      return {
        time: new Date(),
        // In Kelvin
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
        precipitationProbabilities,
        // hourlyForecast,
      };
    }),
});
