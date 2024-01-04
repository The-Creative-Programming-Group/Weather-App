import React, { useEffect, useRef, useState } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { observer } from "@legendapp/state/react";
import cn from "classnames";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { RxCross2 } from "react-icons/rx";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

import type { ICity } from "@weatherio/types";

import search2Image from "~/assets/search2.png";
import Layout from "~/components/Layout";
import { api } from "~/lib/utils/api";
import { activeCity$, addedCities$ } from "~/states";

const LocationSettings = observer(() => {
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
  const [isInputActive, setIsInputActive] = useState<boolean>(true); // activeInput is the input field that is active
  const inputRef = useRef<HTMLInputElement>(null); // inputRef is the ref of the input field

  const { t: translationLocationSettings } = useTranslation("locationsettings");
  const { t: translationCommon } = useTranslation("common");

  const { data: findCitiesByNameData = [], status: findCitiesByNameStatus } =
    api.search.findCitiesByName.useQuery({
      name: searchValue.name,
    });

  const { data: findCityByIdData = [], status: findCityByIdStatus } =
    api.search.findCityById.useQuery({
      id: searchValue.id,
    });

  const { data: findCityByNameData = [], status: findCityByNameStatus } =
    api.search.findCityByName.useQuery({
      name: searchValue.name,
    });

  const findCityByCoordinatesMutation =
    api.reverseGeoRouter.getCity.useMutation({
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
    if (!findCitiesByNameData || findCitiesByNameStatus !== "success") return;
    setResults(findCitiesByNameData);
  }, [searchValue, findCitiesByNameData, findCitiesByNameStatus]);

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

  const searchCity = () => {
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
    if (
      searchValue.id.toString().length === 15 ||
      searchValue.id.toString().length === 14
    ) {
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
        if (findCityByIdStatus === "loading") {
          toast.loading(translationLocationSettings("try again toast"));
          return;
        }
        if (!Array.isArray(findCityByIdData)) {
          city = findCityByIdData.city;
        } else {
          toast.error(translationLocationSettings("city not found toast"));
          return;
        }
      } else {
        if (findCityByNameStatus === "loading") {
          toast.loading(translationLocationSettings("try again toast"));
          return;
        }
        if (!Array.isArray(findCityByNameData)) {
          city = findCityByNameData.city;
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
        toast.success(translationLocationSettings("switched to city toast"));
      } else if (existingCity) {
        activeCity$.set(existingCity);
        toast.success(translationLocationSettings("switched to city toast"));
      } else {
        addedCities$.push(city);
        activeCity$.set(city);
        toast.success(translationLocationSettings("added city toast"));
      }
    } else {
      toast.error(translationLocationSettings("city not found toast"));
    }
  };

  return (
    <>
      <Layout title={translationCommon("menu locations")}>
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
                  className={cn(
                    "w-full border-b-2 border-black bg-[#d8d5db] pb-0.5 pl-3 pt-0.5 text-xl font-bold text-black outline-none",
                    {
                      "pr-10":
                        findCitiesByNameStatus === "loading" &&
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
                  value={searchValue.name}
                  onBlur={() => {
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
                  {findCitiesByNameStatus === "loading" &&
                  inputRef.current?.value &&
                  inputRef.current?.value.length > 0 ? (
                    <ClipLoader color={"#ffffff"} loading={true} size={20} />
                  ) : null}
                </div>
              </div>{" "}
            </div>
            {results.map((city: ICity) => {
              if (
                isInputActive &&
                city.name
                  .toLowerCase()
                  .startsWith(searchValue.name.toLowerCase())
              ) {
                return (
                  <button
                    className={
                      isInputActive
                        ? "flex h-auto w-9/12 items-center justify-between border-b-2 border-gray-400 bg-[#d8d5db] p-5 md:w-5/12"
                        : "hidden"
                    }
                    aria-label={city.name}
                    key={city.id}
                    onClick={() => {
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
                      setIsInputActive(false);
                      inputRef.current?.blur();
                      // console.log(searchValue);
                    }}
                  >
                    <span className="w-1/2 text-left">
                      {city.name
                        .split("")
                        .map((letter: string, letterIndex: number) => (
                          <span
                            className={
                              letterIndex < searchValue.name.length
                                ? "font-bold"
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
                      <span className="w-2/3 overflow-hidden overflow-ellipsis text-left text-gray-500 sm:w-full">
                        {city.region}
                      </span>{" "}
                    </div>
                  </button>
                );
              }
            })}
            <div className="mt-2 flex w-full justify-center">
              <div className="block w-9/12 md:w-5/12">
                {addedCities$.get().map((city: ICity) => {
                  return (
                    <div
                      className={
                        activeCity$.id.get() === city.id
                          ? "relative mt-2 flex cursor-pointer justify-between border-2 border-black bg-[#d8d5db] p-2"
                          : "relative mt-2 flex cursor-pointer justify-between border border-solid border-black bg-[#d8d5db] p-2"
                      }
                      key={city.id}
                    >
                      <button
                        onClick={() => {
                          activeCity$.set(city);
                        }}
                        className="mr-5 flex w-full items-center justify-between text-left"
                      >
                        <span className="w-1/2">{city.name}</span>{" "}
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
                className="mt-2.5 rounded border-2 bg-white p-2 font-bold text-[#2d3142] transition duration-500 ease-in-out hover:shadow-2xl"
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
                {translationLocationSettings("my location button")}
              </button>
              <button
                onClick={() => {
                  searchCity();
                }}
                className="mb-2.5 mt-2.5 rounded border-2 border-black bg-[#2d3142] p-2 font-bold text-white"
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["locationsettings", "common"])),
    },
  };
}

export default LocationSettings;
