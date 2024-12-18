import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useMutation, useQuery } from "convex/react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

import type { ICity } from "@weatherio/types";
import { api } from "@weatherio/city-data";

import background from "~/assets/background.png";
import search1Image from "~/assets/search1.png";
import { getLocaleProps, useCurrentLocale, useScopedI18n } from "~/locales";
import { activeCity$, addedCities$ } from "~/states";

const Search = () => {
  const locale = useCurrentLocale();
  const router = useRouter();
  const [searchedValue, setSearchedValue] = useState<ICity>({
    id: "",
    name: "",
    country: "",
    region: "",
    coord: {
      lon: 0,
      lat: 0,
    },
    germanName: "",
  }); // searchValue is the value of the input field
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<ICity[]>([]); // results is the list of cities that match the searchValue
  const [isInputActive, setIsInputActive] = useState<boolean>(true); // this looks if the input field is active
  const inputRef = useRef<HTMLInputElement>(null); // inputRef is the ref of the input field

  const translationCommon = useScopedI18n("common");
  const translationSearch = useScopedI18n("search");
  const translationLocationSettings = useScopedI18n("locationsettings");

  /*
  Fetches on every change in the search Value the cities that match the search value
   */

  const findCitiesByName = useQuery(api.getCity.findCitiesByName, {
    name: searchQuery,
  });

  const findCityById = useQuery(api.getCity.findCityById, {
    id: searchedValue.id,
  });

  const findCityByCoordinatesMutation = useMutation(
    api.getCity.findNearestCityByCoord,
  );

  useEffect(() => {
    if (searchQuery === "") {
      setResults([]);
      return;
    }
    if (findCitiesByName === undefined) return;
    setResults(() => {
      const cities: ICity[] = [];
      findCitiesByName.map((city) => {
        cities.push({
          id: city._id,
          name: city.name,
          country: city.country,
          region: city.region,
          coord: {
            lon: city.lon,
            lat: city.lat,
          },
          germanName: city.germanName,
        });
      });
      return cities;
    });
  }, [findCitiesByName, searchQuery]);

  // Gets called if the user clicks on the "continue" button or press enter
  const searchCity = () => {
    inputRef.current?.blur();
    let city: ICity | undefined = {
      id: "",
      name: "",
      country: "",
      region: "",
      coord: {
        lon: 0,
        lat: 0,
      },
      germanName: undefined,
    };
    if (
      searchedValue.id !== "" &&
      searchedValue.country !== "" &&
      (searchedValue.name === searchQuery ||
        searchedValue.germanName === searchQuery)
    ) {
      if (findCityById === undefined) {
        toast.loading(translationLocationSettings("try again toast"));
        return;
      }
      if (findCityById) {
        city = {
          id: findCityById._id,
          name: findCityById.name,
          germanName: findCityById.germanName,
          region: findCityById.region,
          country: findCityById.country,
          coord: {
            lat: findCityById.lat,
            lon: findCityById.lon,
          },
        };
      } else {
        toast.error(translationLocationSettings("city not found toast"));
        return;
      }
    } else {
      if (findCitiesByName?.[0]) {
        city = {
          id: findCitiesByName[0]._id,
          name: findCitiesByName[0].name,
          germanName: findCitiesByName[0].germanName,
          region: findCitiesByName[0].region,
          country: findCitiesByName[0].country,
          coord: {
            lat: findCitiesByName[0].lat,
            lon: findCitiesByName[0].lon,
          },
        };
      } else {
        toast.error(translationLocationSettings("city not found toast"));
        return;
      }
    }

    if (city) {
      if (addedCities$.get().find((value: ICity) => value.id === city.id)) {
        activeCity$.set(city);
        void router.push("/home?cityId=" + city.id);
      } else {
        addedCities$.push(city);
        activeCity$.set(city);
        void router.push("/home?cityId=" + city.id);
      }
      setSearchedValue({
        id: "",
        name: "",
        country: "",
        region: "",
        coord: {
          lon: 0,
          lat: 0,
        },
        germanName: "",
      });
      setSearchQuery("");
    } else {
      toast.error(translationLocationSettings("city not found toast"));
    }
  };

  return (
    <>
      <Head>
        <title>{translationCommon("search page title")}</title>
        <meta name="description" content="A fabulous weather website" />
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
            // See here: https://stackoverflow.com/questions/2180645/is-automatically-assigning-focus-bad-for-accessibility
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            className={clsx(
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
            value={searchQuery}
            onBlur={async () => {
              setIsInputActive(false);
            }}
            onChange={(event) => {
              setSearchQuery(event.target.value);
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
              <ClipLoader color={"#ffffff"} loading size={20} />
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
              aria-label={
                locale === "de" && city.germanName ? city.germanName : city.name
              }
              key={city.id}
              /**
               * I chose onMouseDown over onClick
               * because if you choose onClick,
               * the onBlur function runs before onClick runs
               * and the onClick function never will get executed
               */
              onMouseDown={() => {
                setSearchedValue((prevSearchValue): ICity => {
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
                setSearchQuery(
                  locale === "de" && city.germanName
                    ? city.germanName
                    : city.name,
                );
              }}
            >
              <span>
                {(locale === "de" && city.germanName
                  ? city.germanName
                  : city.name
                )
                  .split("")
                  .map((letter: string, letterIndex: number) => (
                    <span
                      className={
                        (locale === "de" && city.germanName
                          ? city.germanName
                          : city.name
                        )
                          .toLowerCase()
                          .startsWith(searchQuery.toLowerCase())
                          ? letterIndex < searchQuery.length
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

                    void findCityByCoordinatesMutation({
                      coord: { lat: latitude, lon: longitude },
                    }).then((data) => {
                      if (data) {
                        setSearchedValue({
                          id: data._id,
                          name: data.name,
                          germanName: data.germanName,
                          region: data.region,
                          coord: {
                            lat: data.lat,
                            lon: data.lon,
                          },
                          country: data.country,
                        });
                        setSearchQuery(
                          locale === "de" && data.germanName
                            ? data.germanName
                            : data.name,
                        );
                      } else {
                        toast.error(
                          translationLocationSettings("city not found toast"),
                        );
                      }
                    });
                  });
                }
              }}
            >
              {translationSearch("my location button")}
            </button>
            {searchQuery.length > 0 ? (
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

export const getStaticProps = getLocaleProps();

export default Search;
