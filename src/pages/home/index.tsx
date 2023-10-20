import React from "react";
import Layout from "~/components/Layout";
import {api} from "~/lib/utils/api";
import {activeCity$, temperatureUnit$, windSpeedUnit$, WindSpeedUnitType,} from "~/states";
import {IDailyForecast, IHourlyForecast} from "~/types";
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
import {WiRaindrop} from "react-icons/wi";
import cn from "classnames";
import {PiSunglasses} from "react-icons/pi";
import {BsWind} from "react-icons/bs";
import {Skeleton} from "~/components/ui/skeleton";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dynamic from "next/dynamic";
import {HoverCard, HoverCardContent, HoverCardTrigger,} from "~/components/ui/hover-card";
import {Button} from "~/components/ui/button";
import {InfoIcon, LinkIcon} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/router";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import ReactHtmlParser from "react-html-parser";
import {observer} from "@legendapp/state/react";

const Map = dynamic(() => import("~/components/ui/map"), { ssr: false });

dayjs.extend(utc);
dayjs.extend(timezone);

function convertWindSpeed(
  speedInMetersPerSecond: number,
  unit: WindSpeedUnitType,
): number {
  let convertedSpeed: number = 0;

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
      } // The scale continues up to force 12 - hurricane
      break;
    default:
      throw new Error("Invalid unit for wind speed");
  }

  return convertedSpeed;
}

const InternalHome = observer(() => {
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
            return <FaCloudShowersHeavy className="h-12 w-12" />;
          }
          return translationHome("weather state stormy");
        }
      }
      if (weatherData.data?.hourlyForecast[hour]?.snowfall) {
        if (weatherData.data.hourlyForecast[hour]!.snowfall! > 0) {
          if (icons) {
            return <FaCloudMeatball className="h-12 w-12" />;
          }
          return translationHome("weather state snowy");
        }
      }
      if (weatherData.data?.hourlyForecast[hour]?.rain) {
        if (weatherData.data.hourlyForecast[hour]!.rain! > 0) {
          if (icons) {
            return <FaCloudRain className="h-12 w-12" />;
          }
          return translationHome("weather state rainy");
        }
      }
      if (weatherData.data?.hourlyForecast[hour]?.cloudcover) {
        if (weatherData.data.hourlyForecast[hour]!.cloudcover! > 40) {
          if (weatherData.data.hourlyForecast[hour!]!.cloudcover! > 60) {
            if (icons) {
              return <FaCloud className="h-12 w-12" />;
            }
            return translationHome("weather state very cloudy");
          } else {
            if (weatherData.data) {
              if (
                weatherData.data.hourlyForecast[hour!]!.time < 19 &&
                weatherData.data.hourlyForecast[hour!]!.time > 6
              ) {
                if (icons) {
                  return <FaCloudSun className="h-12 w-12" />;
                }
                return translationHome("weather state cloudy");
              } else {
                if (icons) {
                  return <FaCloudMoon className="h-12 w-12" />;
                }
                return translationHome("weather state cloudy");
              }
            }
          }
        }
        if (weatherData.data?.dailyForecast[hour]?.windSpeed) {
          if (weatherData.data.dailyForecast[hour]!.windSpeed! >= 20) {
            if (icons) {
              return <FaWind className="h-12 w-12" />;
            }
            return translationHome("weather state windy");
          }
        }
      }
    } else if (day !== undefined && day !== null) {
      if (weatherData.data?.dailyForecast[day]?.showers) {
        if (weatherData.data.dailyForecast[day]!.showers! > 0) {
          if (icons) {
            return <FaCloudShowersHeavy className="h-12 w-12" />;
          }
          return translationHome("weather state stormy");
        }
      }
      if (weatherData.data?.dailyForecast[day]?.snowfall) {
        if (weatherData.data.dailyForecast[day]!.snowfall! > 0) {
          if (icons) {
            return <FaCloudMeatball className="h-12 w-12" />;
          }
          return translationHome("weather state snowy");
        }
      }
      if (weatherData.data?.dailyForecast[day]?.rain) {
        if (weatherData.data.dailyForecast[day]!.rain! > 0) {
          if (icons) {
            return <FaCloudRain className="h-12 w-12" />;
          }
          return translationHome("weather state rainy");
        }
      }
      if (weatherData.data?.dailyForecast[day]?.cloudcover) {
        if (weatherData.data.dailyForecast[day]!.cloudcover! > 40) {
          if (weatherData.data.dailyForecast[day!]!.cloudcover! > 60) {
            if (icons) {
              return <FaCloud className="h-12 w-12" />;
            }
            return translationHome("weather state cloudy");
          } else {
            if (icons) {
              return <FaCloudSun className="h-12 w-12" />;
            }
            return translationHome("weather state cloudy");
          }
        }
      }
      if (weatherData.data?.dailyForecast[day]?.windSpeed) {
        if (weatherData.data.dailyForecast[day]!.windSpeed! >= 20) {
          if (icons) {
            return <FaWind className="h-12 w-12" />;
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
          return <FaSun className="h-12 w-12" />;
        } else {
          return <FaMoon className="h-12 w-12" />;
        }
      }
    } else if (icons && hour === undefined) {
      // console.log("Sunny", hour, day);
      return <FaSun className="h-12 w-12" />;
    }
    return translationHome("weather state sunny");
  };

  const mapPosition: [number, number] = [
    activeCity$.coord.lat.get(),
    activeCity$.coord.lon.get(),
  ];

  return (
    <Layout>
      <div className="mt-24 flex flex-col items-center">
        <h1 className="text-7xl">{activeCity$.name.get()}</h1>
        <h1 className="mt-3 text-7xl text-gray-500">
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
      <div className="mt-12 flex flex-col items-center">
        <div className="flex max-w-screen-xl justify-evenly rounded-md bg-gray-400">
          {weatherData.data?.hourlyForecast ? (
            <>
              {weatherData.data.hourlyForecast.map(
                (hourlyForecast: IHourlyForecast, index: number) => {
                  let time;
                  let isSunsetOrSunrise = false;
                  let sunEvent = "";
                  const currentHour = new Date().getHours();
                  if (
                    weatherData.data.sunset &&
                    dayjs(weatherData.data.sunset).hour() ===
                      hourlyForecast.time
                  ) {
                    isSunsetOrSunrise = true;
                    sunEvent = translationHome("sunset");
                  } else if (
                    weatherData.data.sunrise &&
                    dayjs(weatherData.data.sunrise).hour() ===
                      hourlyForecast.time
                  ) {
                    isSunsetOrSunrise = true;
                    sunEvent = translationHome("sunrise");
                  }

                  if (hourlyForecast.time === currentHour) {
                    time = translationHome("now");
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
                      className="m-2 flex w-32 flex-col items-center"
                      key={index}
                    >
                      <div className="mt-1.5 font-semibold">{time}</div>
                      {isSunsetOrSunrise && (
                        <div className="mt-1.5">{sunEvent}</div>
                      )}
                      {weatherState({ hour: index, icons: true })}
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
                        "Not available"
                      )}
                    </div>
                  );
                },
              )}
            </>
          ) : (
            <Skeleton className="h-36 w-screen-xl" />
          )}
        </div>
        <div className="grid-rows-7 mb-6 mt-6 grid max-w-screen-xl grid-cols-9 gap-6">
          {weatherData.data?.dailyForecast ? (
            <>
              <div className="col-span-3 row-span-6 flex flex-col rounded-xl bg-gray-400">
                <div className="flex w-full items-center justify-between pb-2 pl-5 pr-3 pt-2 text-xl">
                  {translationHome("9 day forecast")}{" "}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button className="w-10 rounded-full p-1.5">
                        <InfoIcon className="h-full w-full" />
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
                        className="mb-2 ml-5 mr-5 flex items-center border-t-2 border-black"
                        key={index}
                      >
                        <div className="mt-2 w-40 text-2xl">{day}</div>
                        <div className="mt-2 w-16">
                          {weatherState({ day: index, icons: true })}
                        </div>
                        {dailyForecast.temperatureDay ? (
                          <div className="mt-2 w-20 text-2xl">
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
                          "Not available"
                        )}
                        {dailyForecast.temperatureNight ? (
                          <div className="mt-2 w-20 text-2xl text-gray-700">
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
                          "Not available"
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </>
          ) : (
            <Skeleton className="col-span-3 row-span-6 w-96" />
          )}

          {weatherData.data?.precipitationProbabilities ? (
            <div className="col-span-4 col-start-4 row-span-1 rounded-md bg-gray-400 pb-2">
              <div className="mt-1.5 flex justify-between pl-4 pr-3 text-xl">
                {translationHome("precipitation")}{" "}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button className="w-10 rounded-full p-1.5">
                      <InfoIcon className="h-full w-full" />
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
                  let raindropClass = "";
                  if (value !== undefined && value !== null) {
                    raindropClass = cn(
                      "w-20",
                      "h-20",
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
                      <div className="text-sm">
                        {translationHome(key.slice(2))}
                      </div>
                      <WiRaindrop className={raindropClass} />
                      <div className="-mt-4 text-xl">{value}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <Skeleton className="col-span-4 col-start-4 row-span-1 h-32 w-full" />
          )}

          {weatherData.data?.feels_like ? (
            <div className="col-span-2 col-start-4 row-span-2 row-start-2 rounded-md bg-gray-400">
              <div className="mt-1.5 flex justify-between pl-4 pr-3 text-xl">
                {translationHome("feels like")}{" "}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button className="w-10 rounded-full p-1.5">
                      <InfoIcon className="h-full w-full" />
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
                <div className="flex text-5xl">
                  {temperatureUnit$.get() === "Celsius"
                    ? `${Math.round(weatherData.data?.feels_like - 273.15)}°C`
                    : `${Math.round(
                        (weatherData.data?.feels_like * 9) / 5 - 459.67,
                      )}°F`}
                </div>
                <div className="text-sm font-medium text-gray-500">
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
            <Skeleton className="col-span-2 col-start-4 row-span-2 row-start-2 h-32" />
          )}

          {weatherData.data?.air_quality ? (
            <div className="col-span-1 col-start-4 row-span-3 row-start-4 rounded-md bg-gray-400">
              <div className="ml-2 mt-1.5 text-xl">
                {translationHome("air quality")}
              </div>
              <div className="relative mb-2 ml-3.5 mt-2 flex h-64 items-center">
                <div className="text-md mt-2 w-20 font-medium">
                  {weatherData.data?.air_quality.toPrecision(2)} <br />
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
                </div>
                <div className="absolute right-3 h-64 w-3 rounded-md bg-gradient-to-t from-red-500 to-green-800">
                  <div
                    className="relative h-3 w-full rounded-xl bg-black"
                    style={{
                      top: `${
                        weatherData.data.air_quality > 80
                          ? weatherData.data.air_quality - 3
                          : weatherData.data.air_quality
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <Skeleton className="col-span-1 col-start-4 row-span-3 row-start-4" />
          )}

          {weatherData.data?.visibility ? (
            <div className="col-span-2 col-start-6 row-span-2 row-start-2 rounded-md bg-gray-400">
              <div className="mt-1.5 flex justify-between pl-4 pr-3 text-xl">
                {translationHome("visibility")}{" "}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button className="w-10 rounded-full p-1.5">
                      <InfoIcon className="h-full w-full" />
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
              <div className="flex items-center">
                <PiSunglasses className="ml-4 mt-2 h-16 w-16" />
                <div className="ml-4 mt-2 text-5xl">
                  {weatherData.data?.visibility}%
                </div>
              </div>
            </div>
          ) : (
            <Skeleton className="col-span-2 col-start-6 row-span-2 row-start-2" />
          )}

          {weatherData.data?.wind_speed && weatherData.data?.wind_pressure ? (
            <div className="col-span-3 col-start-5 row-span-3 row-start-4 rounded-md bg-gray-400">
              <div className="mt-1.5 flex w-full justify-between pl-4 pr-3 text-xl">
                {translationHome("wind pressure")}{" "}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button className="w-10 rounded-full p-1.5">
                      <InfoIcon className="h-full w-full" />
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
                      <LinkIcon className="ml-1 inline h-4 w-4" />
                    </Link>
                    <br />
                    <span className="font-semibold">
                      {translationHome("speed")}:
                    </span>{" "}
                    In {translationCommon(windSpeedUnit$.get())}
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="ml-9 flex flex-col">
                <BsWind className="mt-5 h-32 w-32" />
                <div className="mt-9 flex gap-10 text-xl">
                  <div>
                    {translationHome("pressure")}
                    <div className="mt-2">
                      {weatherData.data.wind_pressure.toPrecision(2)} Pa
                    </div>
                  </div>
                  <div>
                    {translationHome("speed")}
                    {weatherData.data?.wind_speed ? (
                      <div className="mt-2">
                        {convertWindSpeed(
                          weatherData.data.wind_speed,
                          windSpeedUnit$.get(),
                        ).toPrecision(2)}{" "}
                        {translationCommon(windSpeedUnit$.get())}
                      </div>
                    ) : (
                      "Loading..."
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Skeleton className="col-span-3 col-start-5 row-span-3 row-start-4 h-96 w-96" />
          )}
          <div className="z-0 col-span-2 col-start-8 row-span-6 rounded-md bg-gray-400">
            <Map position={mapPosition} className="h-full w-full rounded-md" />
          </div>
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
