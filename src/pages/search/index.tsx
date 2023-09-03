import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { cities, ICity } from "~/testdata";
import { activeCity$, addedCities$ } from "~/states";
import { toast, ToastContainer } from "react-toastify";
import search1Image from "~/assets/search1.png"
import background from "~/assets/background.png";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";
const DraggableMarker = dynamic(() => import("../../components/ui/DraggableMarker"), { ssr: false });

const Search = () => {
  const searchFocusRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  let cityFound = false;

  useEffect(() => {
    if (!searchFocusRef.current) return;
    searchFocusRef.current.focus();
  }, []);

  const handleStadtclick = (name: string) => {
    setSearchValue(name);
  };
  const checkContinue = () => {
    if (activeCity$.get().name !== "") {
      location.href = "/home";
    } else {
      toast.error("Please select a city");
    }
  };
  const checkCity = () => {
    cities.map((city: ICity) => {
      if (city.name.toLowerCase() === searchValue.toLowerCase()) {
        cityFound = true;
        if (
          addedCities$.get().some((cityValue) => cityValue.name === city.name)
        ) {
          activeCity$.set({
            name: city.name,
            coordinates: {
              lat: city.coordinates.lat,
              lon: city.coordinates.lon,
            },
          });
          location.href = "/home";
        } else {
          continueValue(city);
        }
      }
    });

    if (!cityFound) {
      toast.error("City not found");
      cityFound = false;
    }
  };

  const continueValue = (city: ICity) => {
    activeCity$.set({
      name: city.name,
      coordinates: { lat: city.coordinates.lat, lon: city.coordinates.lon },
    });
    addedCities$.push({
      name: city.name,
      population: city.population,
      coordinates: { lat: city.coordinates.lat, lon: city.coordinates.lon },
    });
    location.href = "/home";
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleInputFocus = (inputName: string) => {
    setActiveInput(inputName);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  let anzahl = 0;
  cities.sort(
    (cityA: ICity, cityB: ICity) => cityB.population - cityA.population,
  );

  return (
    <>
      <ToastContainer />
      <Head>
        <title>{"Search - Weather.io"}</title>
        <meta name="description" content="An faboulus weather website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        src={background}
        alt="background"
        className="absolute w-full h-full -z-10 object-cover"
        fill
      />
      <div id="styles-setup" className="mt-24 w-full flex justify-center">
        <Image
          className="transform bg-[#383b53] border-solid border-[#2d3142] border-8 border-r-0 pt-3 pb-3 pl-3 w-1/36"
          src={search1Image}
          alt="search-icon"
          width={56}
          height={56}
        />

        <input
          className="w-5/12 bg-[#383b53] border-solid border-[#2d3142] border-8 border-l-0 pt-0.5 pb-0.5 outline-0 text-xl pl-3 text-white"
          placeholder="Search for your location"
          type="text"
          // Autofocus didn't work, so I used useRef() to focus the input field
          ref={searchFocusRef}
          onChange={handleChange}
          onFocus={() => handleInputFocus("input2")}
          value={searchValue}
          onBlur={handleInputBlur}
        />
      </div>
      <div className="flex flex-col items-center">
        {cities.map((city: ICity) => {
          if (
            searchValue !== "" &&
            city.name.toLowerCase().startsWith(searchValue.toLowerCase())
          ) {
            anzahl++;

            if (anzahl <= 4) {
              return (
                <div
                  className={
                    activeInput === "input2"
                      ? "block w-12+5/12 h-auto border-b-2 border-gray-400 text-amber-50 bg-[#383b53] p-5 hover: cursor-pointer z-20"
                      : "hidden"
                  }
                  key={city.name}
                  onMouseDown={() => handleStadtclick(city.name)}
                >
                  <p>
                    {city.name
                      .split("")
                      .map((letter: string, letterIndex: number) => (
                        <span
                          className={
                            letterIndex < searchValue.length ? "font-bold" : ""
                          }
                          key={letterIndex}
                        >
                          {letter}
                        </span>
                      ))}
                  </p>
                </div>
              );
            }
          }
        })}

        <div className="absolute mt-24 left-1/2 transform -translate-x-1/2 w-3/5 h-128 border-solid border-[#2d3142] border-8">
          <DraggableMarker className="w-full h-full"/>
                </div>
              <button
              onClick={checkCity}
              className="absolute z-30 bottom-14 right-1 w-40 h-10 text-white bg-[#2d3142] rounded text-2xl hover:shadow-2xl transition duration-500 ease-in-out"
            >
              <p>{"Continue ->"}</p>
            </button>

      </div>
    </>
  );
};

export default Search;
