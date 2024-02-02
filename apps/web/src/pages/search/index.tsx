import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import cn from "classnames";
import { useQuery } from "convex/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

import type { ICity } from "@weatherio/types";
import { api as convexApi } from "@weatherio/city-data";

import background from "~/assets/background.png";
import search1Image from "~/assets/search1.png";
import { api as tRPCApi } from "~/lib/utils/api";
import { activeCity$, addedCities$ } from "~/states";

const Search = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<ICity>({
    id: 0,
    name: "",
    country: "",
    region: "",
    coord: {
      lon: 0,
      lat: 0,
    },
  }); // searchValue is the value of the input field
  const [results, setResults] = useState<ICity[]>([]); // results is the list of cities that match the searchValue
  const [isInputActive, setIsInputActive] = useState<boolean>(true); // this looks if the input field is active
  const inputRef = useRef<HTMLInputElement>(null); // inputRef is the ref of the input field

  const { t: translationCommon } = useTranslation("common");
  const { t: translationSearch } = useTranslation("search");
  const { t: translationLocationSettings } = useTranslation("locationsettings");

  /*
  Fetches on every change in the search Value the cities that match the search value
   */

  const findCitiesByName = useQuery(convexApi.getCity.findCitiesByName, {
    name: searchValue.name,
  });

  const findCityById = useQuery(convexApi.getCity.findCityById, {
    id: searchValue.id,
  });

  const findCityByCoordinatesMutation =
    tRPCApi.reverseGeoRouter.getCity.useMutation({
      onSuccess: (data) => {
        if (data) {
          setSearchValue(data);
        } else {
          toast.error(translationLocationSettings("city not found toast"));
        }
      },
    });

  useEffect(() => {
    if (searchValue.name === "") {
      setResults([]);
      return;
    }
    if (findCitiesByName === undefined) return;
    setResults(() => {
      const cities: ICity[] = [];
      findCitiesByName.map((city) => {
        cities.push({
          id: city.id,
          name: city.name,
          country: city.country,
          region: city.region,
          coord: {
            lon: city.coord.lon,
            lat: city.coord.lat,
          },
        });
      });
      return cities;
    });
  }, [searchValue, findCitiesByName]);

  // Gets called if the user clicks on the "continue" button or press enter
  const searchCity = () => {
    inputRef.current?.blur();
    let city: ICity | undefined = {
      id: 0,
      name: "",
      country: "",
      region: "",
      coord: {
        lon: 0,
        lat: 0,
      },
    };
    if (searchValue.id.toString().length > 15) {
      city = {
        id: searchValue.id,
        name: searchValue.name,
        country: searchValue.country,
        region: searchValue.region,
        coord: {
          lon: searchValue.coord.lon,
          lat: searchValue.coord.lat,
        },
      };
    } else {
      if (searchValue.id !== 0 && searchValue.country !== "") {
        if (findCityById === undefined) {
          toast.loading(translationLocationSettings("try again toast"));
          return;
        }
        if (findCityById) {
          city = {
            id: findCityById.id,
            name: findCityById.name,
            country: findCityById.country,
            region: findCityById.region,
            coord: {
              lon: findCityById.coord.lon,
              lat: findCityById.coord.lat,
            },
          };
        } else {
          toast.error(translationLocationSettings("city not found toast"));
          return;
        }
      } else {
        if (findCitiesByName?.[0]) {
          city = {
            id: findCitiesByName[0].id,
            name: findCitiesByName[0].name,
            country: findCitiesByName[0].country,
            region: findCitiesByName[0].region,
            coord: {
              lon: findCitiesByName[0].coord.lon,
              lat: findCitiesByName[0].coord.lat,
            },
          };
        } else {
          toast.error(translationLocationSettings("city not found toast"));
          return;
        }
      }
    }

    if (city) {
      const existingCity = addedCities$
        .get()
        .find((value: ICity) => value.name === city!.name);
      if (addedCities$.get().find((value: ICity) => value.id === city!.id)) {
        activeCity$.set(city);
        void router.push("/home");
      } else if (existingCity) {
        activeCity$.set(existingCity);
        void router.push("/home");
      } else {
        addedCities$.push(city);
        activeCity$.set(city);
        void router.push("/home");
      }
    } else {
      toast.error(translationLocationSettings("city not found toast"));
    }
  };

  return (
    <>
      <Head>
        <title>{translationCommon("search page title")}</title>
        <meta name="description" content="An faboulus weather website" />
      </Head>
      <Image
        src={background as StaticImport}
        alt="background"
        className="-z-10 object-cover"
        fill
      />
      <div className="flex w-full items-center justify-center">
        <div
          id="styles-setup"
          className="relative mt-80 flex w-9/12 justify-center border-8 border-solid border-[#2d3142] md:w-6/12"
        >
          <Image
            className="transform bg-[#383b53] pb-1.5 pl-1.5 pt-1.5 md:w-12 md:pb-3 md:pl-3 md:pt-3"
            src={search1Image as StaticImport}
            alt="search-icon"
            width={40}
            height={40}
          />

          <input
            className={cn(
              "w-full bg-[#383b53] pl-1.5 text-xl text-white outline-none md:pb-0.5 md:pl-3 md:pt-0.5",
              {
                "pr-10":
                  findCitiesByName === undefined &&
                  inputRef.current?.value &&
                  inputRef.current?.value.length > 0,
              },
            )}
            placeholder={translationSearch("search input placeholder")}
            type="text"
            onFocus={() => {
              setIsInputActive(true);
            }}
            value={searchValue.name}
            onBlur={async () => {
              setIsInputActive(false);
            }}
            onChange={(event) => {
              setSearchValue((prevSearchValue): ICity => {
                return {
                  ...prevSearchValue,
                  id: 0,
                  name: event.target.value,
                };
              });
            }}
            ref={inputRef}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                searchCity();
              }
            }}
          />
          <div className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2">
            {findCitiesByName === undefined &&
            inputRef.current?.value &&
            inputRef.current?.value.length > 0 ? (
              <ClipLoader color={"#ffffff"} loading={true} size={20} />
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {results.map((city: ICity) => {
          return (
            <button
              className={
                isInputActive
                  ? "z-20 flex h-auto w-9/12 items-center justify-between border-b-2 border-gray-400 bg-[#383b53] p-5 text-left text-amber-50 md:w-6/12"
                  : "hidden"
              }
              aria-label={city.name}
              key={city.id}
              /**
               * I chose onMouseDown over onClick
               * because if you choose onClick,
               * the onBlur function runs before onClick runs
               * and the onClick function never will get executed
               */
              onMouseDown={() => {
                setSearchValue((prevSearchValue): ICity => {
                  return {
                    ...prevSearchValue,
                    id: city.id,
                    name: city.name,
                    country: city.country,
                    region: city.region,
                    coord: {
                      lon: city.coord.lon,
                      lat: city.coord.lat,
                    },
                  };
                });
              }}
            >
              <span>
                {city.name
                  .split("")
                  .map((letter: string, letterIndex: number) => (
                    <span
                      className={
                        city.name
                          .toLowerCase()
                          .startsWith(searchValue.name.toLowerCase())
                          ? letterIndex < searchValue.name.length
                            ? "font-bold"
                            : ""
                          : ""
                      }
                      key={letterIndex}
                    >
                      {letter}
                    </span>
                  ))}
              </span>
              <div className="flex w-1/2 flex-row-reverse items-center gap-0.5 sm:w-1/4 sm:gap-3">
                <span>{city.country}</span>
                <span className="w-2/3 overflow-hidden overflow-ellipsis sm:w-full">
                  {city.region}
                </span>{" "}
              </div>
            </button>
          );
        })}
        <div className="mt-12 flex h-1/6 w-full justify-center md:transform">
          <div className="flex w-max flex-col items-center gap-4">
            <button
              className="z-10 w-full rounded border-2 bg-white p-2 pb-2 pt-2 text-2xl text-[#2d3142] transition duration-500 ease-in-out hover:shadow-2xl"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    findCityByCoordinatesMutation.mutate({
                      coordinates: { lat: latitude, lng: longitude },
                    });
                  });
                }
              }}
            >
              {translationSearch("my location button")}
            </button>
            {searchValue.name.length > 0 ? (
              <button
                onClick={() => {
                  searchCity();
                }}
                className="z-10 flex h-12 w-full items-center justify-center rounded border-2 border-black bg-[#2d3142] p-2 text-2xl text-white transition duration-500 ease-in-out hover:shadow-2xl"
              >
                <p>{translationSearch("continue button")}</p>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "search",
        "locationsettings",
      ])),
    },
  };
}

export default Search;
