import React, { useState, useRef, useEffect } from "react";
import Layout from "~/components/Layout";
import { activeCity$, addedCities$ } from "~/states";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { observer } from "@legendapp/state/react-components";
import { ToastContainer, toast } from "react-toastify";
import search2Image from "~/assets/search2.png";
import "react-toastify/dist/ReactToastify.css";
import { ICity } from "~/types";
import citiesJSON from "~/lib/city-list.json";

const cities = citiesJSON as ICity[];

const LocationSettings = observer(() => {
  const [searchValue, setSearchValue] = useState(""); // searchValue is the value of the input field
  const [results, setResults] = useState<ICity[]>([]); // results is the list of cities that match the searchValue
  const [isInputActive, setIsInputActive] = useState<boolean>(false); // activeInput is the input field that is active
  const inputRef = useRef<HTMLInputElement>(null); // inputRef is the ref of the input field

  useEffect(() => {
    if (searchValue === "") {
      setResults([]);
      return;
    }
    setResults(
      cities
        .filter((city: ICity) =>
          city.name.toLowerCase().includes(searchValue.toLowerCase()),
        )
        .slice(0, 4),
    );
  }, [searchValue]);

  const setToActiveCity = (city: ICity) => {
    activeCity$.set(city);
  };

  const removeCityFromAddedCities = (city: ICity) => {
    if (addedCities$.get().length === 1) {
      toast.error("You must have at least one city");
      return;
    }
    addedCities$.set((prev) =>
      prev.filter((value) => value.name !== city.name),
    );
    if (activeCity$.name.get() === city.name) {
      activeCity$.set(addedCities$.get()[0]);
    }
  };

  return (
    <>
      <ToastContainer />
      <Layout title="Location Settings">
        <div className="flex w-full flex-col items-center">
          <h1 className="mt-24 flex justify-center text-3xl font-bold">
            Location settings
          </h1>
          <hr className="mt-3 h-1.5 w-4/12 rounded bg-[#2d3142]" />
          <div
            id="styles-setup"
            className="mt-9 flex w-full flex-col items-center"
          >
            <div
              id="styles-setup"
              className="flex w-full flex-col items-center"
            >
              <label className="mr-131 mb-2 font-bold">Add new location</label>
              <div className="flex w-full justify-center">
                <Image
                  className="w-12 transform border-b-2 border-black bg-[#d8d5db] pb-3 pl-3 pt-3"
                  src={search2Image}
                  alt="search-icon"
                  width={56}
                  height={56}
                />
                <input
                  className="w-4/12 border-b-2 border-black bg-[#d8d5db] pb-0.5 pl-3 pt-0.5 text-xl font-bold text-black outline-0"
                  autoFocus
                  placeholder="Search for your location"
                  type="text"
                  onFocus={() => {
                    setIsInputActive(true);
                  }}
                  value={searchValue}
                  onBlur={() => {
                    setIsInputActive(false);
                  }}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                  }}
                  ref={inputRef}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      // Check if the city is in the list of cities
                      const city = cities.find(
                        (city: ICity) =>
                          city.name.toLowerCase() === searchValue.toLowerCase(),
                      );
                      if (city) {
                        if (
                          addedCities$
                            .get()
                            .find((value: ICity) => value.name === city.name)
                        ) {
                          toast.error("City already added");
                        } else {
                          addedCities$.push(city);
                          activeCity$.set(city);
                          toast.success("City added");
                        }
                      } else {
                        toast.error("City not found");
                      }
                    }
                  }}
                />
              </div>{" "}
            </div>
            {results.map((city: ICity) => {
              if (
                isInputActive &&
                city.name.toLowerCase().startsWith(searchValue.toLowerCase())
              ) {
                return (
                  <div
                    className={
                      isInputActive
                        ? "flex justify-between w-36/100 h-auto border-b-2 border-gray-400 bg-[#d8d5db] p-5 hover: cursor-pointer"
                        : "hidden"
                    }
                    key={city.id}
                    onMouseDown={() => {
                      setSearchValue(city.name);
                      setIsInputActive(false);
                      inputRef.current?.blur();
                    }}
                  >
                    <p>
                      {city.name
                        .split("")
                        .map((letter: string, letterIndex: number) => (
                          <span
                            className={
                              letterIndex < searchValue.length
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
            <div className="w-full flex justify-center mt-2">
              <div className=" w-36/100 block">
                {addedCities$.get().map((city: ICity) => {
                  return (
                    <div
                      className={
                        activeCity$.name.get() === city.name
                          ? "bg-[#d8d5db] p-2 border-2 border-black mt-2 hover: cursor-pointer flex justify-between"
                          : "bg-[#d8d5db] p-2 border border-solid border-black mt-2 hover: cursor-pointer flex justify-between"
                      }
                      key={city.name}
                    >
                      <div
                        onClick={() => {
                          setToActiveCity(city);
                        }}
                        className="w-full flex justify-between mr-5"
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
                // Check if the city is in the list of cities
                const city = cities.find(
                  (city: ICity) =>
                    city.name.toLowerCase() === searchValue.toLowerCase(),
                );
                if (city) {
                  if (
                    addedCities$
                      .get()
                      .find((value: ICity) => value.name === city.name)
                  ) {
                    toast.error("City already added");
                  } else {
                    addedCities$.push(city);
                    activeCity$.set(city);
                    toast.success("City added");
                  }
                } else {
                  toast.error("City not found");
                }
              }}
              className="mt-2.5 mb-2.5 rounded border-solid bg-[#2d3142] p-2 font-bold text-white"
            >
              Add New Location
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
});

export default LocationSettings;
