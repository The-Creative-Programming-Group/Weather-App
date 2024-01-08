import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { observer } from "@legendapp/state/react";
import cn from "classnames";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ReactHtmlParser from "react-html-parser";
import { BsWind } from "react-icons/bs";
import {
  FaCloud,
  FaCloudMeatball,
  FaCloudMoon,
  FaCloudRain,
  FaCloudShowersHeavy,
  FaCloudSun,
  FaMoon,
  FaSun,
  FaWind,
} from "react-icons/fa6";
import { LuChevronDownSquare, LuInfo, LuLink } from "react-icons/lu";
import { PiSunglasses } from "react-icons/pi";
import { WiRaindrop } from "react-icons/wi";

import type { IDailyForecast, IHourlyForecast } from "@weatherio/types";
import { Button } from "@weatherio/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@weatherio/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@weatherio/ui/hover-card";
import { ScrollArea, ScrollBar } from "@weatherio/ui/scroll-area";
import { Skeleton } from "@weatherio/ui/skeleton";

import type { WindSpeedUnitType } from "~/states";
import Layout from "~/components/Layout";
import { MoonPhaseInfo } from "~/components/moon-phase-info";
import { api } from "~/lib/utils/api";
import { activeCity$, temperatureUnit$, windSpeedUnit$ } from "~/states";

const Map = dynamic(() => import("@weatherio/ui/map"), { ssr: false });

dayjs.extend(utc);
dayjs.extend(timezone);

function convertWindSpeed(
  speedInMetersPerSecond: number,
  unit: WindSpeedUnitType,
): number {
  let convertedSpeed = 0;

  switch (unit) {
    case "miles per hour":
      convertedSpeed = speedInMetersPerSecond * 2.23694;
      break;
    case "kilometers per hour":
      convertedSpeed = speedInMetersPerSecond * 3.6;
      break;
    case "knots":
      convertedSpeed = speedInMetersPerSecond * 1.94384;
      break;
    case "meters per second":
      convertedSpeed = speedInMetersPerSecond;
      break;
    case "beaufort":
      if (speedInMetersPerSecond < 0.3) {
        convertedSpeed = 0; // Calm
      } else if (speedInMetersPerSecond < 1.6) {
        convertedSpeed = 1; // Light air
      } else if (speedInMetersPerSecond < 3.4) {
        convertedSpeed = 2; // Light breeze
      } else if (speedInMetersPerSecond < 5.5) {
        convertedSpeed = 3; // Gentle breeze
      } else if (speedInMetersPerSecond < 8) {
        convertedSpeed = 4; // Moderate breeze
      } else if (speedInMetersPerSecond < 10.8) {
        convertedSpeed = 5; // Fresh breeze
      } else if (speedInMetersPerSecond < 13.9) {
        convertedSpeed = 6; // Strong breeze
      } else if (speedInMetersPerSecond < 17.2) {
        convertedSpeed = 7; // High wind
      } else if (speedInMetersPerSecond < 20.8) {
        convertedSpeed = 8; // Gale
      } else if (speedInMetersPerSecond < 24.5) {
        convertedSpeed = 9; // Strong gale
      } else if (speedInMetersPerSecond < 28.5) {
        convertedSpeed = 10; // Storm
      } else if (speedInMetersPerSecond < 32.7) {
        convertedSpeed = 11; // Violent storm
      } else {
        convertedSpeed = 12; // Hurricane
      }
      break;
    default:
      throw new Error("Invalid unit for wind speed");
  }

  return convertedSpeed;
}

const InternalHome = observer(() => {
  const [isMoreInfoCollapsibleOpen, setIsMoreInfoCollapsibleOpen] =
    React.useState(false);
  const { locale } = useRouter();
  const weatherData = api.weather.getWeather.useQuery(
    { coordinates: activeCity$.coord.get(), timezone: dayjs.tz.guess() },
    // TODO: The cache (stale time) is not yet working if you refresh the page
    { refetchOnWindowFocus: false, staleTime: 1000 * 60 * 60 /* 1 hour */ },
  );
  let temperature = undefined;
  if (weatherData.data?.temperature) {
    temperature =
      temperatureUnit$.get() === "Celsius"
        ? `${Math.round(weatherData.data?.temperature - 273.15)}°C`
        : `${Math.round((weatherData.data?.temperature * 9) / 5 - 459.67)}°F`;
  }

  const { t: translationHome } = useTranslation("home");
  const { t: translationCommon } = useTranslation("common");

  type WeatherStateType = string | React.ReactNode | undefined;

  type TimeType =
    | { hour: number; day?: undefined; icons: boolean }
    | { hour?: undefined; day: number; icons: boolean };

  const weatherState = ({ hour, day, icons }: TimeType): WeatherStateType => {
    if (hour !== undefined && hour !== null) {
      if (weatherData.data?.hourlyForecast[hour]?.showers) {
        if (weatherData.data.hourlyForecast[hour]!.showers! > 0) {
          if (icons) {
            return <FaCloudShowersHeavy className="h-full w-full" />;
          }
          return translationHome("weather state stormy");
        }
      }
      if (weatherData.data?.hourlyForecast[hour]?.snowfall) {
        if (weatherData.data.hourlyForecast[hour]!.snowfall! > 0) {
          if (icons) {
            return <FaCloudMeatball className="h-full w-full" />;
          }
          return translationHome("weather state snowy");
        }
      }
      if (weatherData.data?.hourlyForecast[hour]?.rain) {
        if (weatherData.data.hourlyForecast[hour]!.rain! > 0) {
          if (icons) {
            return <FaCloudRain className="h-full w-full" />;
          }
          return translationHome("weather state rainy");
        }
      }
      if (weatherData.data?.hourlyForecast[hour]?.cloudcover) {
        if (weatherData.data.hourlyForecast[hour]!.cloudcover! > 40) {
          if (weatherData.data.hourlyForecast[hour]!.cloudcover! > 60) {
            if (icons) {
              return <FaCloud className="h-full w-full" />;
            }
            return translationHome("weather state very cloudy");
          } else {
            if (weatherData.data) {
              if (
                weatherData.data.hourlyForecast[hour]!.time < 19 &&
                weatherData.data.hourlyForecast[hour]!.time > 6
              ) {
                if (icons) {
                  return <FaCloudSun className="h-full w-full" />;
                }
                return translationHome("weather state cloudy");
              } else {
                if (icons) {
                  return <FaCloudMoon className="h-full w-full" />;
                }
                return translationHome("weather state cloudy");
              }
            }
          }
        }
        if (weatherData.data?.dailyForecast[hour]?.windSpeed) {
          if (weatherData.data.dailyForecast[hour]!.windSpeed! >= 20) {
            if (icons) {
              return <FaWind className="h-full w-full" />;
            }
            return translationHome("weather state windy");
          }
        }
      }
    } else if (day !== undefined && day !== null) {
      if (weatherData.data?.dailyForecast[day]?.showers) {
        if (weatherData.data.dailyForecast[day]!.showers! > 0) {
          if (icons) {
            return <FaCloudShowersHeavy className="h-full w-full" />;
          }
          return translationHome("weather state stormy");
        }
      }
      if (weatherData.data?.dailyForecast[day]?.snowfall) {
        if (weatherData.data.dailyForecast[day]!.snowfall! > 0) {
          if (icons) {
            return <FaCloudMeatball className="h-full w-full" />;
          }
          return translationHome("weather state snowy");
        }
      }
      if (weatherData.data?.dailyForecast[day]?.rain) {
        if (weatherData.data.dailyForecast[day]!.rain! > 0) {
          if (icons) {
            return <FaCloudRain className="h-full w-full" />;
          }
          return translationHome("weather state rainy");
        }
      }
      if (weatherData.data?.dailyForecast[day]?.cloudcover) {
        if (weatherData.data.dailyForecast[day]!.cloudcover! > 40) {
          if (weatherData.data.dailyForecast[day]!.cloudcover! > 60) {
            if (icons) {
              return <FaCloud className="h-full w-full" />;
            }
            return translationHome("weather state cloudy");
          } else {
            if (icons) {
              return <FaCloudSun className="h-full w-full" />;
            }
            return translationHome("weather state cloudy");
          }
        }
      }
      if (weatherData.data?.dailyForecast[day]?.windSpeed) {
        if (weatherData.data.dailyForecast[day]!.windSpeed! >= 20) {
          if (icons) {
            return <FaWind className="h-full w-full" />;
          }
          return translationHome("weather state windy");
        }
      }
    }
    if (icons && day === undefined) {
      if (weatherData.data) {
        if (
          weatherData.data.hourlyForecast[hour]!.time < 19 &&
          weatherData.data.hourlyForecast[hour]!.time > 6
        ) {
          // console.log("Sunny", hour, day)
          return <FaSun className="h-full w-full" />;
        } else {
          return <FaMoon className="h-full w-full" />;
        }
      }
    } else if (icons && hour === undefined) {
      // console.log("Sunny", hour, day);
      return <FaSun className="h-full w-full" />;
    }
    return translationHome("weather state sunny");
  };

  const mapPosition: [number, number] = [
    activeCity$.coord.lat.get(),
    activeCity$.coord.lon.get(),
  ];

  return (
    <Layout classNameShareButton="mt-44">
      <div className="mt-24 flex flex-col items-center">
        <h1 className="text-center text-4xl sm:text-5xl md:text-7xl">
          {activeCity$.name.get()}
        </h1>
        <h1 className="mt-3 text-6xl text-gray-500 md:text-7xl">
          {temperature ? temperature : <Skeleton className="h-20 w-36" />}
        </h1>
        <p className="mt-3 text-xl">
          {weatherData.data ? (
            weatherState({ hour: 0, icons: false })
          ) : (
            <Skeleton className="h-9 w-36" />
          )}
        </p>
        <div className="mt-1 flex gap-5 text-gray-500">
          <p className="text-xl">
            {weatherData.data?.highestTemperature ? (
              temperatureUnit$.get() === "Celsius" ? (
                `H: ${Math.round(
                  weatherData.data.highestTemperature - 273.15,
                )}°C`
              ) : (
                `${Math.round(
                  (weatherData.data.highestTemperature * 9) / 5 - 459.67,
                )}°F`
              )
            ) : (
              <Skeleton className="h-7 w-24" />
            )}
          </p>
          <p className="text-xl">
            {weatherData.data?.minimumTemperature ? (
              temperatureUnit$.get() === "Celsius" ? (
                `L: ${Math.round(
                  weatherData.data.minimumTemperature - 273.15,
                )}°C`
              ) : (
                `${Math.round(
                  (weatherData.data.minimumTemperature * 9) / 5 - 459.67,
                )}°F`
              )
            ) : (
              <Skeleton className="h-7 w-24" />
            )}
          </p>
        </div>
      </div>
      {weatherData?.data?.maxUVIndex && weatherData.data.sunHours ? (
        <Collapsible
          className="mt-2 flex w-full flex-col items-center"
          open={isMoreInfoCollapsibleOpen}
          onOpenChange={setIsMoreInfoCollapsibleOpen}
        >
          <CollapsibleTrigger className="flex gap-1 outline-0">
            {translationHome("more information")}:{" "}
            <LuChevronDownSquare
              className={cn("h-6 w-6", {
                "rotate-180 transform": isMoreInfoCollapsibleOpen,
              })}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-1">
            <div>
              <span className="font-bold">{translationHome("sun hours")}:</span>{" "}
              {weatherData.data.sunHours}h
            </div>
            <div>
              <span className="font-bold">UV-Index:</span>{" "}
              {weatherData.data.maxUVIndex}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ) : null}
      <div className="mt-12 flex flex-col items-center">
        {weatherData.data?.hourlyForecast ? (
          <ScrollArea className="mb-5 w-11/12 rounded-md xl:w-9/12">
            <div className="relative flex w-full justify-evenly rounded-md bg-gray-400">
              {weatherData.data.hourlyForecast.map(
                (hourlyForecast: IHourlyForecast, index: number) => {
                  let time;
                  let sunEvent = "";
                  const currentHour = new Date().getHours();
                  if (
                    weatherData.data.sunset &&
                    dayjs(weatherData.data.sunset).hour() ===
                      hourlyForecast.time
                  ) {
                    sunEvent = translationHome("sunset");
                  } else if (
                    weatherData.data.sunrise &&
                    dayjs(weatherData.data.sunrise).hour() ===
                      hourlyForecast.time
                  ) {
                    sunEvent = translationHome("sunrise");
                  }

                  if (index === 0) {
                    if (hourlyForecast.time === currentHour) {
                      time = translationHome("this hour");
                    } else {
                      // Don't render this hour if it's already passed
                      return null;
                    }
                  } else if (hourlyForecast.time === currentHour) {
                    time = translationHome("this hour");
                  } else if (hourlyForecast.time === 12) {
                    time = "12" + translationHome("late hour time ending");
                  } else if (hourlyForecast.time > 12) {
                    time =
                      hourlyForecast.time -
                      12 +
                      translationHome("late hour time ending");
                  } else if (hourlyForecast.time === 0) {
                    time = "12" + translationHome("early hour time ending");
                  } else {
                    time =
                      hourlyForecast.time +
                      translationHome("early hour time ending");
                  }
                  return (
                    <div
                      className="m-3 flex flex-col items-center justify-center text-center md:m-6"
                      key={index}
                    >
                      <div className="mt-1.5 font-semibold">{time}</div>
                      {sunEvent && (
                        <div className="mt-1.5 text-center">{sunEvent}</div>
                      )}
                      <div className="flex h-12 w-12 justify-center">
                        {weatherState({ hour: index, icons: true })}
                      </div>
                      {hourlyForecast.temperature ? (
                        <div>
                          {temperatureUnit$.get() === "Celsius"
                            ? `${Math.round(
                                hourlyForecast.temperature - 273.15,
                              )}°C`
                            : `${Math.round(
                                (hourlyForecast.temperature * 9) / 5 - 459.67,
                              )}°F`}
                        </div>
                      ) : (
                        translationHome("not available")
                      )}
                    </div>
                  );
                },
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <Skeleton className="mb-5 h-36 w-11/12 xl:w-9/12" />
        )}
        {weatherData.data?.dailyForecast ? (
          <ScrollArea className="w-11/12 rounded-md xl:w-9/12">
            <div className="relative flex w-full justify-evenly rounded-md bg-gray-400 md:hidden">
              {weatherData.data.dailyForecast.map(
                (dailyForecast: IDailyForecast, index: number) => {
                  let day;
                  if (index === 0) {
                    day = translationHome("today");
                  } else {
                    day = new Date(dailyForecast.date).toLocaleString(locale, {
                      weekday: "long",
                    });
                  }
                  return (
                    <div
                      className="m-3 flex flex-col items-center md:m-6"
                      key={index}
                    >
                      <div className="mt-1.5 font-semibold">{day}</div>
                      <div className="h-12 w-12">
                        {weatherState({ day: index, icons: true })}
                      </div>
                      {dailyForecast.temperatureDay ? (
                        <div>
                          {temperatureUnit$.get() === "Celsius"
                            ? `${Math.round(
                                dailyForecast.temperatureDay - 273.15,
                              )}°C`
                            : `${Math.round(
                                (dailyForecast.temperatureDay * 9) / 5 - 459.67,
                              )}°F`}
                        </div>
                      ) : (
                        translationHome("not available")
                      )}
                      {dailyForecast.temperatureNight ? (
                        <div className="text-gray-700">
                          {temperatureUnit$.get() === "Celsius"
                            ? `${Math.round(
                                dailyForecast.temperatureNight - 273.15,
                              )}°C`
                            : `${Math.round(
                                (dailyForecast.temperatureNight * 9) / 5 -
                                  459.67,
                              )}°F`}
                        </div>
                      ) : (
                        translationHome("not available")
                      )}
                    </div>
                  );
                },
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <Skeleton className="block h-36 w-11/12 md:hidden xl:w-9/12" />
        )}
        <div className="mb-6 mt-6 grid w-11/12 grid-cols-9 grid-rows-4 gap-6 md:mb-6 xl:w-9/12">
          {weatherData.data?.dailyForecast ? (
            <>
              <div className="col-span-3 row-span-4 hidden flex-col rounded-xl bg-gray-400 md:flex">
                <div className="flex w-full items-center justify-between pb-2 pl-5 pr-3 pt-2 text-xl">
                  {translationHome("9 day forecast")}{" "}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        className="aspect-square h-7 w-7 rounded-full p-1.5 md:h-10 md:w-10"
                        aria-label="Infos over forecast card"
                      >
                        <LuInfo className="h-full w-full" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <span className="font-semibold underline">
                        {translationHome("9 day forecast")}:
                      </span>
                      <br /> <br />
                      {ReactHtmlParser(
                        translationHome("9 day forecast card content"),
                      )}
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className="flex h-full flex-col justify-evenly">
                  {weatherData.data.dailyForecast.map(
                    (dailyForecast: IDailyForecast, index: number) => {
                      let day;
                      if (index === 0) {
                        day = translationHome("today");
                      } else {
                        day = new Date(dailyForecast.date).toLocaleString(
                          locale,
                          {
                            weekday: "long",
                          },
                        );
                      }
                      return (
                        <div
                          className="ml-3 mr-5 flex w-11/12 items-center justify-between border-t-2 border-black pl-2"
                          key={index}
                        >
                          <div className="mt-2 w-2/5 text-base xl:text-2xl">
                            {day}
                          </div>
                          <div className="mt-2 w-1/5 xl:pl-1 xl:pr-4">
                            {weatherState({ day: index, icons: true })}
                          </div>
                          <div className="flex w-1/5 flex-col items-center justify-around xl:w-2/5 xl:flex-row">
                            {dailyForecast.temperatureDay ? (
                              <div className="mt-2 text-base xl:text-2xl">
                                {temperatureUnit$.get() === "Celsius"
                                  ? `${Math.round(
                                      dailyForecast.temperatureDay - 273.15,
                                    )}°C`
                                  : `${Math.round(
                                      (dailyForecast.temperatureDay * 9) / 5 -
                                        459.67,
                                    )}°F`}
                              </div>
                            ) : (
                              translationHome("not available")
                            )}
                            {dailyForecast.temperatureNight ? (
                              <div className="mt-2 text-base text-gray-700 xl:text-2xl">
                                {temperatureUnit$.get() === "Celsius"
                                  ? `${Math.round(
                                      dailyForecast.temperatureNight - 273.15,
                                    )}°C`
                                  : `${Math.round(
                                      (dailyForecast.temperatureNight * 9) / 5 -
                                        459.67,
                                    )}°F`}
                              </div>
                            ) : (
                              translationHome("not available")
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </>
          ) : (
            <Skeleton className="col-span-3 row-span-4 hidden w-full md:block" />
          )}

          {weatherData.data?.precipitationProbabilities ? (
            <div className="col-span-9 row-span-1 rounded-md bg-gray-400 pb-2 md:col-span-4 md:col-start-4">
              <div className="mt-1.5 flex justify-between pl-4 pr-3 text-xl">
                {translationHome("precipitation")}{" "}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      className="aspect-square h-7 w-7 rounded-full p-1.5 md:h-10 md:w-10"
                      aria-label="Infos over precipitation card"
                    >
                      <LuInfo className="h-full w-full" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-96">
                    <span className="font-semibold underline">
                      {translationHome("precipitation card title")}:
                    </span>
                    <br /> <br />
                    <span className="font-semibold">
                      {translationHome("early morning")}:
                    </span>{" "}
                    12{translationHome("early hour time ending")} - 5
                    {translationHome("early hour time ending")}
                    <br />
                    <span className="font-semibold">
                      {translationHome("morning")}:
                    </span>{" "}
                    6{translationHome("early hour time ending")} - 9
                    {translationHome("early hour time ending")}
                    <br />
                    <span className="font-semibold">
                      {translationHome("noon")}:
                    </span>{" "}
                    10{translationHome("early hour time ending")} - 2
                    {translationHome("late hour time ending")}
                    <br />
                    <span className="font-semibold">
                      {translationHome("afternoon")}:
                    </span>{" "}
                    3{translationHome("late hour time ending")} - 7
                    {translationHome("late hour time ending")}
                    <br />
                    <span className="font-semibold">
                      {translationHome("night")}:
                    </span>{" "}
                    8{translationHome("late hour time ending")} - 11
                    {translationHome("late hour time ending")}
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="ml-4 flex justify-between">
                {Object.entries(
                  weatherData.data.precipitationProbabilities,
                ).map(([key, value]) => {
                  let raindropClass = "h-full w-full -mt-2";
                  if (value !== undefined && value !== null) {
                    raindropClass = cn(
                      "w-full",
                      "h-full",
                      "-mt-2",
                      { "opacity-5": value === 0 },
                      { "opacity-10": value > 0 && value <= 10 },
                      { "opacity-25": value > 10 && value <= 25 },
                      { "opacity-50": value > 25 && value <= 50 },
                      { "opacity-75": value > 50 && value <= 75 },
                      { "opacity-90": value > 75 && value <= 90 },
                      { "opacity-100": value > 75 },
                    );
                  }
                  return (
                    <div
                      className="mt-1 flex w-24 flex-col items-center justify-center"
                      key={key}
                    >
                      <div className="text-xs xl:text-sm">
                        {translationHome(key.slice(2))}
                      </div>
                      <WiRaindrop className={raindropClass} />
                      {value !== undefined && value !== null ? (
                        <div className="-mt-4 text-center text-base md:text-xl">
                          {value}%
                        </div>
                      ) : (
                        <div className="-mt-4 text-center text-base md:text-xl">
                          {translationHome("not available")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <Skeleton className="col-span-9 row-span-1 h-32 w-full md:col-span-4 md:col-start-4" />
          )}

          {weatherData.data?.feels_like ? (
            <div className="col-span-5 row-span-1 row-start-2 rounded-md bg-gray-400 md:col-span-2 md:col-start-4">
              <div className="mt-1.5 flex justify-between pl-4 pr-3 text-xl">
                <span className="hyphens-auto break-words">
                  {translationHome("feels like")}
                </span>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      className="aspect-square h-7 w-7 rounded-full p-1.5 md:h-10 md:w-10"
                      aria-label="Infos over feels like card"
                    >
                      <LuInfo className="h-full w-full" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <span className="font-semibold underline">
                      {translationHome("feels like")}:
                    </span>
                    <br /> <br />
                    {ReactHtmlParser(
                      translationHome("feels like card content"),
                    )}
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="mb-1 ml-4 mt-1.5">
                <div className="flex text-3xl xl:text-5xl">
                  {temperatureUnit$.get() === "Celsius"
                    ? `${Math.round(weatherData.data?.feels_like - 273.15)}°C`
                    : `${Math.round(
                        (weatherData.data?.feels_like * 9) / 5 - 459.67,
                      )}°F`}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {weatherData.data.feels_like > 309
                    ? translationHome("feels like phrase very warm")
                    : weatherData.data.feels_like > 299
                      ? translationHome("feels like phrase warm")
                      : weatherData.data.feels_like > 279
                        ? translationHome("feels like phrase moderate")
                        : weatherData.data.feels_like > 269
                          ? translationHome("feels like phrase cold")
                          : translationHome("feels like phrase very cold")}
                </div>
              </div>
            </div>
          ) : (
            <Skeleton className="col-span-5 row-span-1 row-start-2 md:col-span-2 md:col-start-4" />
          )}

          {weatherData.data?.air_quality ? (
            <div className="col-span-5 row-span-2 row-start-3 rounded-md bg-gray-400 md:col-span-2 md:col-start-4 md:row-span-1 xl:col-span-1 xl:col-start-4">
              <div className="ml-2 mt-1.5 hyphens-auto break-words text-xl">
                {translationHome("air quality")}
              </div>
              <div className="relative mb-2 ml-3.5 mt-2 flex h-64 items-center justify-center xl:justify-normal">
                <div className="text-md mt-2 w-full pr-6 font-medium">
                  {weatherData.data?.air_quality !== 100
                    ? weatherData.data?.air_quality.toPrecision(2)
                    : "100"}{" "}
                  <br />
                  <span className="hyphens-auto break-words">
                    {weatherData.data?.air_quality > 90
                      ? translationHome("air quality text very poor")
                      : weatherData.data?.air_quality > 70
                        ? translationHome("air quality text poor")
                        : weatherData.data?.air_quality > 50
                          ? translationHome("air quality text fair")
                          : weatherData.data?.air_quality > 30
                            ? translationHome("air quality text moderate")
                            : weatherData.data?.air_quality > 10
                              ? translationHome("air quality text good")
                              : translationHome("air quality text excellent")}
                  </span>
                </div>
                <div className="relative right-3 h-64 w-4 rounded-xl bg-gradient-to-t from-red-500 to-green-800 xl:absolute xl:w-3 xl:rounded-md">
                  <div
                    className="relative h-4 w-full rounded-xl bg-black xl:h-3"
                    style={{
                      top: `${
                        weatherData.data.air_quality > 80
                          ? weatherData.data.air_quality - 4
                          : weatherData.data.air_quality
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <Skeleton className="col-span-5 row-span-2 row-start-3 md:col-span-2 md:col-start-4 md:row-span-1 xl:col-span-1 xl:col-start-4" />
          )}

          {weatherData.data?.visibility ? (
            <div className="col-span-4 col-start-6 row-span-1 row-start-2 rounded-md bg-gray-400 md:col-span-2 md:col-start-6">
              <div className="mt-1.5 flex justify-between pl-4 pr-3 text-xl">
                <span className="hyphens-auto break-words">
                  {translationHome("visibility")}
                </span>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      className="aspect-square h-7 w-7 rounded-full p-1.5 md:h-10 md:w-10"
                      aria-label="Infos over visibility card"
                    >
                      <LuInfo className="h-full w-full" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <span className="font-semibold underline">
                      {translationHome("visibility card title")}:
                    </span>
                    <br /> <br />
                    100% = 10km
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="flex w-full items-center">
                <PiSunglasses className="ml-4 mt-2 hidden h-auto w-5/12 sm:block md:w-8/12 xl:h-32 xl:w-32" />
                <div className="ml-4 mt-2 text-3xl xl:text-5xl">
                  {weatherData.data?.visibility}%
                </div>
              </div>
            </div>
          ) : (
            <Skeleton className="col-span-4 col-start-6 row-span-1 row-start-2 md:col-span-2 md:col-start-6" />
          )}

          {weatherData.data?.wind_speed !== undefined &&
          weatherData.data?.wind_pressure !== undefined ? (
            <div className="col-span-4 col-start-6 row-span-1 row-start-3 rounded-md bg-gray-400 md:col-span-2 md:col-start-6 xl:col-span-3 xl:col-start-5">
              <div className="mb-2 mt-1.5 flex w-full justify-between pl-4 pr-3 text-xl">
                <span className="hyphens-auto break-words">
                  {translationHome("wind pressure")}
                </span>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      className="aspect-square h-7 w-7 rounded-full p-1.5 md:h-10 md:w-10"
                      aria-label="Infos over wind pressure card"
                    >
                      <LuInfo className="h-full w-full" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <span className="font-semibold underline">
                      {translationHome("wind pressure card title")}:
                    </span>{" "}
                    <br /> <br />
                    <span className="font-semibold">
                      {translationHome("pressure")}:
                    </span>{" "}
                    In{" "}
                    <Link
                      className="underline"
                      href="https://en.wikipedia.org/wiki/Pascal_(unit)"
                    >
                      Pascal (Pa)
                      <LuLink className="ml-1 inline h-4 w-4" />
                    </Link>
                    <br />
                    <span className="font-semibold">
                      {translationHome("speed")}:
                    </span>{" "}
                    In {translationCommon(windSpeedUnit$.get())}
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="ml-3 flex h-3/5 w-full flex-row gap-3 md:flex-col xl:ml-4 xl:h-full">
                <BsWind className="mt-5 hidden min-h-[33%] w-3/12 sm:block md:w-7/12 xl:h-28 xl:w-28" />
                <div className="mb-3 mt-0 flex flex-col gap-3 text-xs md:text-base xl:mt-3 xl:flex-row xl:gap-10 xl:text-xl">
                  <div>
                    <span className="font-bold md:font-normal">
                      {translationHome("pressure")}
                    </span>
                    <div className="mt-2">
                      {weatherData.data.wind_pressure.toPrecision(2)} Pa
                    </div>
                  </div>
                  <div className="hyphens-auto break-words pr-3">
                    <span className="font-bold md:font-normal">
                      {translationHome("speed")}
                    </span>
                    <div className="mt-2 pr-1 xl:pr-8">
                      {convertWindSpeed(
                        weatherData.data.wind_speed,
                        windSpeedUnit$.get(),
                      ).toPrecision(2)}{" "}
                      {translationCommon(windSpeedUnit$.get())}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Skeleton className="col-span-4 col-start-6 row-span-1 row-start-3 w-full md:col-span-2 md:col-start-6 xl:col-span-3 xl:col-start-5" />
          )}

          {weatherData.data?.moonPhaseCode ? (
            <div className="col-span-4 col-start-6 row-span-1 row-start-4 rounded-md bg-gray-400 md:col-span-4 md:col-start-4">
              <div className="mt-1.5 flex justify-between pl-4 pr-3 text-xl">
                <span className="hyphens-auto break-words">
                  {translationHome("moon phase")}{" "}
                </span>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      className="aspect-square h-7 w-7 rounded-full p-1.5 md:h-10 md:w-10"
                      aria-label="Infos over moon phase card"
                    >
                      <LuInfo className="h-full w-full" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <span className="font-semibold underline">
                      {translationHome("moon phase card title")}:
                    </span>{" "}
                    <br /> <br />
                    {ReactHtmlParser(
                      translationHome("moon phase card content"),
                    )}
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="mt-2 flex flex-col items-center justify-center hyphens-auto break-words text-center">
                <MoonPhaseInfo
                  moonPhaseCode={parseInt(weatherData.data.moonPhaseCode)}
                />
              </div>
            </div>
          ) : (
            <Skeleton className="col-span-4 col-start-6 row-span-1 row-start-4 w-full md:col-span-4 md:col-start-4" />
          )}

          <div className="z-0 col-span-2 col-start-8 row-span-4 row-start-1 hidden rounded-md bg-gray-400 md:block">
            <div className="h-full w-full">
              <Map
                position={mapPosition}
                className="h-full w-full rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="z-0 mb-6 block h-96 w-11/12 rounded-md md:hidden">
          <Map position={mapPosition} className="h-full w-full rounded-md" />
        </div>
      </div>
    </Layout>
  );
});

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["home", "common"])),
    },
  };
}

export default InternalHome;
