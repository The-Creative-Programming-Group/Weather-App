import axios, { AxiosResponse } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";

const API_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = env.OPEN_WEATHER_API_KEY;

interface OpenWeatherApiData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weather: string;
}

async function fetchOpenWeatherAPIData(
  cityName: string
): Promise<OpenWeatherApiData> {
  try {
    const response: AxiosResponse = await axios.get(API_ENDPOINT, {
      params: {
        q: cityName,
        units: "metric",
        appid: API_KEY,
      },
    });
    const data = response.data;
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      weather: data.weather[0].main,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cityName } = req.query;

  if (!cityName) {
    res.status(400).json({ error: "City name parameter is required" });
    return;
  }

  try {
    const weatherData = await fetchOpenWeatherAPIData(cityName as string);
    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching weather data" });
  }
}
