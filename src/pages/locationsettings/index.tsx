import React, {useEffect, useRef, useState} from "react";
import Layout from "~/components/Layout";
import {activeCity$, addedCities$} from "~/states";
import Image from "next/image";
import {RxCross2} from "react-icons/rx";
import {observer} from "@legendapp/state/react";
import {toast, ToastContainer} from "react-toastify";
import search2Image from "~/assets/search2.png";
import "react-toastify/dist/ReactToastify.css";
import {ICity} from "~/types";
import citiesJSON from "~/lib/city-list.json";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

const cities = citiesJSON as ICity[];

const LocationSettings = observer(() => {
  const [searchValue, setSearchValue] = useState<ICity>({
    id: 0,
    name: "",
    country: "",
    state: "",
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

  useEffect(() => {
    if (searchValue.name === "") {
      setResults([]);
      return;
    }
    setResults(
      cities
        .filter((city: ICity) =>
          city.name.toLowerCase().includes(searchValue.name.toLowerCase()),
        )
        .slice(0, 4),
    );
  }, [searchValue]);

  const setToActiveCity = (city: ICity) => {
    activeCity$.set(city);
  };

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

  return (
    <>
      <ToastContainer />
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
              className="flex w-4/12 flex-col items-center"
            >
              <label className="mb-2 w-full text-left font-bold">
                {translationLocationSettings("add new location")}
              </label>
              <div className="flex w-full justify-center">
                <Image
                  className="w-12 transform border-b-2 border-black bg-[#d8d5db] pb-3 pl-3 pt-3"
                  src={search2Image}
                  alt="search-icon"
                  width={56}
                  height={56}
                />
                <input
                  className="w-full border-b-2 border-black bg-[#d8d5db] pb-0.5 pl-3 pt-0.5 text-xl font-bold text-black outline-0"
                  autoFocus
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
                    setSearchValue((prevSearchValue) => {
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
                      let city: ICity | undefined = {
                        id: 0,
                        name: "",
                        country: "",
                        state: "",
                        coord: {
                          lon: 0,
                          lat: 0,
                        },
                      };
                      if (searchValue.id !== 0 && searchValue.country !== "") {
                        city = cities.find(
                          (city: ICity) => city.id === searchValue.id,
                        );
                      } else {
                        city = cities.find(
                          (city: ICity) =>
                            city.name.toLowerCase() ===
                            searchValue.name.toLowerCase(),
                        );
                      }
                      if (city) {
                        if (
                          addedCities$
                            .get()
                            .find((value: ICity) => value.id === city!.id)
                        ) {
                          activeCity$.set(city);
                          toast.success(
                            translationLocationSettings(
                              "switched to city toast",
                            ),
                          );
                        } else {
                          addedCities$.push(city);
                          activeCity$.set(city);
                          toast.success(
                            translationLocationSettings("added city toast"),
                          );
                        }
                      } else {
                        toast.error(
                          translationLocationSettings("city not found toast"),
                        );
                      }
                    }
                  }}
                />
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
                  <div
                    className={
                      isInputActive
                        ? "hover: flex h-auto w-36/100 cursor-pointer justify-between border-b-2 border-gray-400 bg-[#d8d5db] p-5"
                        : "hidden"
                    }
                    key={city.id}
                    onMouseDown={() => {
                      setSearchValue((prevSearchValue) => {
                        return {
                          ...prevSearchValue,
                          id: city.id,
                          name: city.name,
                          country: city.country,
                          state: city.state,
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
                    <p>
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
                    </p>
                    {city.country}
                  </div>
                );
              }
            })}
            <div className="mt-2 flex w-full justify-center">
              <div className=" block w-36/100">
                {addedCities$.get().map((city: ICity) => {
                  return (
                    <div
                      className={
                        activeCity$.id.get() === city.id
                          ? "hover: mt-2 flex cursor-pointer justify-between border-2 border-black bg-[#d8d5db] p-2"
                          : "hover: mt-2 flex cursor-pointer justify-between border border-solid border-black bg-[#d8d5db] p-2"
                      }
                      key={city.id}
                    >
                      <div
                        onClick={() => {
                          setToActiveCity(city);
                        }}
                        className="mr-5 flex w-full justify-between"
                      >
                        <span>{city.name}</span>{" "}
                        <span className="text-gray-500">{city.country}</span>
                      </div>
                      <div className="flex">
                        <RxCross2
                          onClick={() => removeCityFromAddedCities(city)}
                          className="mr-5 mt-1"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => {
                let city: ICity | undefined = {
                  id: 0,
                  name: "",
                  country: "",
                  state: "",
                  coord: {
                    lon: 0,
                    lat: 0,
                  },
                };
                if (searchValue.id !== 0 && searchValue.country !== "") {
                  city = cities.find(
                    (city: ICity) => city.id === searchValue.id,
                  );
                } else {
                  city = cities.find(
                    (city: ICity) =>
                      city.name.toLowerCase() ===
                      searchValue.name.toLowerCase(),
                  );
                }
                if (city) {
                  if (
                    addedCities$
                      .get()
                      .find((value: ICity) => value.id === city!.id)
                  ) {
                    activeCity$.set(city);
                    toast.success(
                      translationLocationSettings("switched to city toast"),
                    );
                  } else {
                    addedCities$.push(city);
                    activeCity$.set(city);
                    toast.success(
                      translationLocationSettings("added city toast"),
                    );
                  }
                } else {
                  toast.error(
                    translationLocationSettings("city not found toast"),
                  );
                }
              }}
              className="mb-2.5 mt-2.5 rounded border-solid bg-[#2d3142] p-2 font-bold text-white"
            >
              {translationLocationSettings("add new location button")}
            </button>
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
