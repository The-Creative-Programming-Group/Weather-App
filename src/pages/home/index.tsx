import React from "react";
import Layout from "~/components/Layout";
import { api } from "~/lib/utils/api";
import { activeCity$, temperatureUnit$ } from "~/states";
import { observer } from "@legendapp/state/react-components";
import { IDailyForecast, IHourlyForecast } from "~/types";
import {FaShare} from "react-icons/fa";
import {
  FaCloud,
  FaCloudMeatball,
  FaCloudRain,
  FaCloudShowersHeavy,
  FaSun,
  FaMoon,
  FaWind,
  FaCloudSun,
  FaCloudMoon,
} from "react-icons/fa6";
import { WiRaindrop } from "react-icons/wi";
import cn from "classnames";

const InternalHome = observer(() => {
  const weatherData = api.weather.getWeather.useQuery(
    { coordinates: activeCity$.coordinates.get() },
    { refetchOnWindowFocus: false },
  );
  let temperature = undefined;
  if (weatherData.data?.temperature) {
    temperature =
      temperatureUnit$.get() === "Celsius"
        ? `${Math.round(weatherData.data?.temperature - 273.15)}°C`
        : `${Math.round((weatherData.data?.temperature * 9) / 5 - 459.67)}°F`;
  }

  type WeatherStateType =
    | "Sunny"
    | "Very Cloudy"
    | "Cloudy"
    | "Rainy"
    | "Stormy"
    | "Snowy"
    | "Windy"
    | JSX.Element
    | undefined;

  type TimeType =
    | { hour: number; day?: undefined; icons: boolean }
    | { hour?: undefined; day: number; icons: boolean };

  const weatherState = ({ hour, day, icons }: TimeType): WeatherStateType => {
    if (hour) {
      if (weatherData.data?.hourlyForecast[hour]?.showers) {
        if (weatherData.data.hourlyForecast[hour]!.showers! > 0) {
          if (icons) {
            return <FaCloudShowersHeavy className="w-12 h-12" />;
          }
          return "Stormy";
        }
      }
      if (weatherData.data?.hourlyForecast[hour]?.snowfall) {
        if (weatherData.data.hourlyForecast[hour]!.snowfall! > 0) {
          if (icons) {
            return <FaCloudMeatball className="w-12 h-12" />;
          }
          return "Snowy";
        }
      }
      if (weatherData.data?.hourlyForecast[hour]?.rain) {
        if (weatherData.data.hourlyForecast[hour]!.rain! > 0) {
          if (icons) {
            return <FaCloudRain className="w-12 h-12" />;
          }
          return "Rainy";
        }
      }
      if (weatherData.data?.hourlyForecast[hour]?.cloudcover) {
        if (weatherData.data.hourlyForecast[hour]!.cloudcover! > 40) {
          if (weatherData.data.hourlyForecast[hour!]!.cloudcover! > 60) {
            if (icons) {
              return <FaCloud className="w-12 h-12" />;
            }
            return "Very Cloudy";
          } else {
            if (weatherData.data) {
              if (
                weatherData.data.hourlyForecast[hour!]!.time < 19 &&
                weatherData.data.hourlyForecast[hour!]!.time > 6
              ) {
                if (icons) {
                  return <FaCloudSun className="w-12 h-12" />;
                }
                return "Cloudy";
              } else {
                if (icons) {
                  return <FaCloudMoon className="w-12 h-12" />;
                }
                return "Cloudy";
              }
            }
          }
        }
        if (weatherData.data?.dailyForecast[hour]?.windSpeed) {
          if (weatherData.data.dailyForecast[hour]!.windSpeed! >= 20) {
            if (icons) {
              return <FaWind className="w-12 h-12" />;
            }
            return "Windy";
          }
        }
      }
    } else if (day) {
      if (weatherData.data?.dailyForecast[day]?.showers) {
        if (weatherData.data.dailyForecast[day]!.showers! > 0) {
          if (icons) {
            return <FaCloudShowersHeavy className="w-10 h-10" />;
          }
          return "Stormy";
        }
      }
      if (weatherData.data?.dailyForecast[day]?.snowfall) {
        if (weatherData.data.dailyForecast[day]!.snowfall! > 0) {
          if (icons) {
            return <FaCloudMeatball className="w-10 h-10" />;
          }
          return "Snowy";
        }
      }
      if (weatherData.data?.dailyForecast[day]?.rain) {
        if (weatherData.data.dailyForecast[day]!.rain! > 0) {
          if (icons) {
            return <FaCloudRain className="w-10 h-10" />;
          }
          return "Rainy";
        }
      }
      if (weatherData.data?.dailyForecast[day]?.cloudcover) {
        if (weatherData.data.dailyForecast[day]!.cloudcover! > 40) {
          if (weatherData.data.dailyForecast[day!]!.cloudcover! > 60) {
            if (icons) {
              return <FaCloud className="w-10 h-10" />;
            }
            return "Cloudy";
          } else {
            if (icons) {
              return <FaCloudSun className="w-10 h-10" />;
            }
            return "Cloudy";
          }
        }
      }
      if (weatherData.data?.dailyForecast[day]?.windSpeed) {
        if (weatherData.data.dailyForecast[day]!.windSpeed! >= 20) {
          if (icons) {
            return <FaWind className="w-10 h-10" />;
          }
          return "Windy";
        }
      }
    }
    if (icons && day === undefined) {
      if (weatherData.data) {
        if (
          weatherData.data.hourlyForecast[hour]!.time < 19 &&
          weatherData.data.hourlyForecast[hour]!.time > 6
        ) {
          return <FaSun className="w-12 h-12" />;
        } else {
          return <FaMoon className="w-12 h-12" />;
        }
      }
    } else if (icons && hour === undefined) {
      return <FaSun className="w-10 h-10" />;
    }
    return "Sunny";
  };

  return (
    <Layout>
      <button className="absolute right-16 bg-[#2d3142] text-amber-50 p-2 rounded flex"> <FaShare className="mr-1.5 mt-1"/> Share</button>
      <div className="mt-24 flex items-center flex-col">
        <h1 className="text-7xl">{activeCity$.name.get()}</h1>
        <h1 className="text-7xl mt-3 text-gray-500">
          {temperature ? temperature : "Loading..."}
        </h1>
        <p className="mt-3 text-xl">
          {weatherState({ hour: 0, icons: false })
            ? weatherState({ hour: 0, icons: false })
            : "Loading..."}
        </p>
      </div>
      <div className="flex flex-col items-center mt-12">
        <div className="rounded-md bg-gray-400 max-w-screen-xl flex justify-evenly">
          {weatherData.data?.hourlyForecast.map(
            (hourlyForecast: IHourlyForecast, index: number) => {
              let time;
              if (hourlyForecast.time === new Date().getUTCHours()) {
                time = "Now";
              } else if (hourlyForecast.time === 12) {
                time = "12PM";
              } else if (hourlyForecast.time > 12) {
                time = `${hourlyForecast.time - 12}PM`;
              } else if (hourlyForecast.time === 0) {
                time = `12AM`;
              } else {
                time = `${hourlyForecast.time}AM`;
              }
              return (
                <div
                  className="m-3 flex flex-col items-center w-20"
                  key={index}
                >
                  <div className="mt-1.5">{time}</div>
                  {weatherState({ hour: index, icons: true })}
                  {hourlyForecast.temperature ? (
                    <div>
                      {temperatureUnit$.get() === "Celsius"
                        ? `${Math.round(hourlyForecast.temperature - 273.15)}°C`
                        : `${Math.round(
                            (hourlyForecast.temperature * 9) / 5 - 459.67,
                          )}°F`}
                    </div>
                  ) : (
                    "Loading..."
                  )}
                </div>
              );
            },
          )}
        </div>
        <div className="grid grid-cols-9 grid-rows-7 gap-6 max-w-screen-xl mt-6">
          <div className="col-span-3 row-span-6 bg-gray-400 rounded-xl flex flex-col">
            <span className="ml-5 mt-2">7-Day Forecast</span>
            {weatherData.data?.dailyForecast.map(
              (dailyForecast: IDailyForecast, index: number) => {
                let day;
                if (index === 0) {
                  day = "Today";
                } else {
                  day = new Date(dailyForecast.date).toLocaleString("en-us", {
                    weekday: "long",
                  });
                }
                return (
                  <div
                    className="flex items-center border-t-2 border-black mr-5 ml-5 mb-2"
                    key={index}
                  >
                    <div className="w-32 text-xl mt-2">{day}</div>
                    <div className="mt-2 w-12">
                      {weatherState({ day: index, icons: true })}
                    </div>
                    {dailyForecast.temperatureDay ? (
                      <div className="mt-2 ml-5">
                        {temperatureUnit$.get() === "Celsius"
                          ? `${Math.round(
                              dailyForecast.temperatureDay - 273.15,
                            )}°C`
                          : `${Math.round(
                              (dailyForecast.temperatureDay * 9) / 5 - 459.67,
                            )}°F`}
                      </div>
                    ) : (
                      "Loading"
                    )}
                    {dailyForecast.temperatureNight ? (
                      <div className="mt-2 ml-4 text-gray-700">
                        {temperatureUnit$.get() === "Celsius"
                          ? `${Math.round(
                              dailyForecast.temperatureNight - 273.15,
                            )}°C`
                          : `${Math.round(
                              (dailyForecast.temperatureNight * 9) / 5 - 459.67,
                            )}°F`}
                      </div>
                    ) : (
                      "Loading"
                    )}
                  </div>
                );
              },
            )}
          </div>
          <div className="col-start-4 col-span-4 row-span-1 bg-gray-400 rounded-md">
            <div className="ml-4 mt-1.5 text-xl">Precipitation</div>
            <div className="flex justify-evenly">
              {weatherData.data?.precipitationProbabilities
                ? Object.entries(
                    weatherData.data?.precipitationProbabilities,
                  ).map(([key, value]) => {
                    let raindropClass = "";
                    if (value) {
                      raindropClass = cn(
                        "w-16",
                        "h-16",
                        { "opacity-0": value === 0 },
                        { "opacity-25": value > 0 && value <= 25 },
                        { "opacity-50": value > 25 && value <= 50 },
                        { "opacity-75": value > 50 && value <= 75 },
                        { "opacity-100": value > 75 },
                      );
                    }
                    return (
                      <div
                        className="flex flex-col items-center mt-1 w-24"
                        key={key}
                      >
                        <div className="text-sm">
                          {key.charAt(2).toUpperCase() + key.slice(3)}
                        </div>
                        <WiRaindrop className={raindropClass} />
                        <div className="text-xl">{value}%</div>
                      </div>
                    );
                  })
                : "Loading..."}
            </div>
          </div>
          <div className="col-start-4 col-span-2 row-start-2 row-span-2 bg-gray-400 rounded-md">
            Div 3
          </div>
          <div className="col-start-4 col-span-1 row-start-4 row-span-3 bg-gray-400 rounded-md">
            Div 4
          </div>
          <div className="col-start-6 col-span-2 row-start-2 row-span-2 bg-gray-400 rounded-md">
            Div 5
          </div>
          <div className="col-start-5 col-span-3 row-start-4 row-span-3 bg-gray-400 rounded-md">
            Div 6
          </div>
          <div className="col-start-8 col-span-2 row-span-6 bg-gray-400 rounded-md">
            Div 7
          </div>
        </div>
      </div>
    </Layout>
  );
});

export default InternalHome;