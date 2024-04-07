import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { observer } from "@legendapp/state/react";
import clsx from "clsx";
import { RxCross2 } from "react-icons/rx";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

import type { ICity } from "@weatherio/types";

import search2Image from "~/assets/search2.png";
import Layout from "~/components/Layout";
import { api } from "~/lib/utils/api";
import { getLocaleProps, useCurrentLocale, useScopedI18n } from "~/locales";
import { activeCity$, addedCities$ } from "~/states";

const LocationSettings = observer(() => {
  const locale = useCurrentLocale();
  const [searchedValue, setSearchedValue] = useState<ICity>({
    id: 0,
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
  const [isInputActive, setIsInputActive] = useState<boolean>(true); // activeInput is the input field that is active
  const inputRef = useRef<HTMLInputElement>(null); // inputRef is the ref of the input field

  const translationLocationSettings = useScopedI18n("locationsettings");
  const translationCommon = useScopedI18n("common");

  /*
  Fetches on every change in the search Value the cities that match the search value
   */

  const { data: findCitiesByNameData = [], status: findCitiesByNameStatus } =
    api.search.findCitiesByName.useQuery({
      name: searchQuery,
    });

  const { data: findCityByIdData = [], status: findCityByIdStatus } =
    api.search.findCityById.useQuery({
      id: searchedValue.id,
    });

  const findCityByCoordinatesMutation =
    api.search.findNearestCityByCoord.useMutation({
      onSuccess: (data) => {
        if (data) {
          setSearchedValue({
            id: data.id,
            name: data.name,
            country: data.country,
            region: data.region,
            coord: {
              lat: data.lat,
              lon: data.lon,
            },
            germanName: data.germanName,
          });
          setSearchQuery(
            locale === "de" && data.germanName ? data.germanName : data.name,
          );
        } else {
          toast.error(translationLocationSettings("city not found toast"));
        }
      },
    });

  useEffect(() => {
    if (searchQuery === "") {
      setResults([]);
      return;
    }
    if (!findCitiesByNameData || findCitiesByNameStatus !== "success") return;
    setResults(() => {
      const cities: ICity[] = [];
      findCitiesByNameData.map((city) => {
        cities.push({
          id: city.id,
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
  }, [findCitiesByNameData, findCitiesByNameStatus, searchQuery]);

  const removeCityFromAddedCities = (city: ICity) => {
    if (addedCities$.get().length === 1) {
      toast.error(translationLocationSettings("at least one city toast"));
      return;
    }
    addedCities$.set((prev) => prev.filter((value) => value.id !== city.id));
    if (activeCity$.id.get() === city.id) {
      activeCity$.set(addedCities$.get()[0]);
    }
  };

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
      germanName: null,
    };
    if (searchedValue.id !== 0 && searchedValue.country !== "") {
      if (findCityByIdStatus === "pending") {
        toast.loading(translationLocationSettings("try again toast"));
        return;
      }
      if (!Array.isArray(findCityByIdData)) {
        city = {
          id: findCityByIdData.id,
          name: findCityByIdData.name,
          country: findCityByIdData.country,
          region: findCityByIdData.region,
          coord: {
            lon: findCityByIdData.lon,
            lat: findCityByIdData.lat,
          },
          germanName: findCityByIdData.germanName,
        };
      } else {
        toast.error(translationLocationSettings("city not found toast"));
        return;
      }
    } else {
      if (findCitiesByNameData?.[0]) {
        city = {
          id: findCitiesByNameData[0].id,
          name: findCitiesByNameData[0].name,
          country: findCitiesByNameData[0].country,
          region: findCitiesByNameData[0].region,
          coord: {
            lon: findCitiesByNameData[0].lon,
            lat: findCitiesByNameData[0].lat,
          },
          germanName: findCitiesByNameData[0].germanName,
        };
      } else {
        toast.error(translationLocationSettings("city not found toast"));
        return;
      }
    }

    if (city) {
      if (addedCities$.get().find((value: ICity) => value.id === city.id)) {
        activeCity$.set(city);
        toast.success(translationLocationSettings("switched to city toast"));
      } else {
        addedCities$.push(city);
        activeCity$.set(city);
        toast.success(translationLocationSettings("added city toast"));
      }
      setSearchedValue({
        id: 0,
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
      <Layout
        title={translationCommon("menu locations")}
        page="locationsettings"
      >
        <div className="flex w-full flex-col items-center">
          <h1 className="mt-10 flex justify-center text-4xl font-bold">
            {translationCommon("menu locations")}
          </h1>
          <hr className="mt-3 h-1.5 w-6/12 rounded bg-[#2d3142] md:w-4/12" />
          <div
            id="styles-setup"
            className="mt-9 flex w-full flex-col items-center"
          >
            <div
              id="styles-setup"
              className="flex w-9/12 flex-col items-center md:w-5/12"
            >
              {/* I added the padding right because else on small screens the text would be under the share button */}
              <label className="mb-2 w-full pr-16 text-left font-bold">
                {translationLocationSettings("add new location")}
              </label>
              <div className="relative flex w-full justify-center">
                <Image
                  className="w-12 transform border-b-2 border-black bg-[#d8d5db] pb-3 pl-3 pt-3"
                  src={search2Image as StaticImport}
                  alt="search-icon"
                  width={56}
                  height={56}
                />
                <input
                  className={clsx(
                    "w-full border-b-2 border-black bg-[#d8d5db] pb-0.5 pl-3 pt-0.5 text-xl font-bold text-black outline-none",
                    {
                      "pr-10":
                        findCitiesByNameStatus === "pending" &&
                        inputRef.current?.value &&
                        inputRef.current?.value.length > 0,
                    },
                  )}
                  placeholder={translationLocationSettings(
                    "search input placeholder",
                  )}
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
                  {findCitiesByNameStatus === "pending" &&
                  inputRef.current?.value &&
                  inputRef.current?.value.length > 0 ? (
                    <ClipLoader color={"#ffffff"} loading size={20} />
                  ) : null}
                </div>
              </div>{" "}
            </div>
            {results.map((city: ICity) => {
              return (
                <button
                  className={
                    isInputActive
                      ? "flex h-auto w-9/12 items-center justify-between border-b-2 border-gray-400 bg-[#d8d5db] p-5 text-left md:w-5/12"
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
                  <span className="w-1/2">
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
                    <span className="text-gray-500">{city.country}</span>
                    <span className="w-2/3 overflow-hidden overflow-ellipsis text-gray-500 sm:w-full">
                      {city.region}
                    </span>{" "}
                  </div>
                </button>
              );
            })}
            <div className="mt-2 flex w-full justify-center">
              <div className="block w-9/12 md:w-5/12">
                {addedCities$.get().map((city: ICity) => {
                  return (
                    <div
                      className={
                        activeCity$.id.get() === city.id
                          ? "relative mt-2 flex cursor-pointer justify-between border-2 border-black bg-[#d8d5db] p-2"
                          : "relative mt-2 flex cursor-pointer justify-between bg-[#d8d5db] p-2"
                      }
                      key={city.id}
                    >
                      <button
                        onClick={() => {
                          activeCity$.set(city);
                        }}
                        className="mr-5 flex w-full items-center justify-between text-left"
                      >
                        <span className="w-1/2">
                          {locale === "de" && city.germanName
                            ? city.germanName
                            : city.name}
                        </span>{" "}
                        <div className="flex w-1/2 flex-row-reverse items-center gap-0.5 sm:w-1/4 sm:gap-3">
                          <span className="text-gray-500">{city.country}</span>
                          <span className="w-2/3 overflow-hidden overflow-ellipsis text-gray-500 sm:w-full">
                            {city.region}
                          </span>{" "}
                        </div>
                      </button>
                      <div className="absolute right-0.5 top-1/2 h-5 w-5 -translate-y-1/2">
                        <RxCross2
                          onClick={() => removeCityFromAddedCities(city)}
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex w-max flex-col">
              <button
                className="mt-2.5 min-w-44 rounded border-2 bg-white p-2 font-bold text-[#2d3142] transition duration-500 ease-in-out hover:shadow-2xl"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                      const latitude = position.coords.latitude;
                      const longitude = position.coords.longitude;

                      findCityByCoordinatesMutation.mutate({
                        coord: { lat: latitude, lon: longitude },
                      });
                    });
                  }
                }}
              >
                {findCityByCoordinatesMutation.isPending
                  ? translationLocationSettings("loading")
                  : translationLocationSettings("my location button")}
              </button>
              <button
                onClick={() => {
                  searchCity();
                }}
                className="mb-2.5 mt-2.5 min-w-44 rounded border-2 border-black bg-[#2d3142] p-2 font-bold text-white"
              >
                {translationLocationSettings("add new location button")}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
});

export const getStaticProps = getLocaleProps();

export default LocationSettings;
