import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { cities, ICity } from "~/testdata";
import { activeCity$, addedCities$ } from "~/states";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Search = () => {
  const searchFocusRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  let cityFound = false;

  useEffect(() => {
    if (searchFocusRef.current == undefined) return;
    searchFocusRef.current.focus();
  }, []);

  const handleStadtclick = (name: string) => {
    setSearchValue(name);
  };

  const checkCity = () => {
    cities.map((city: ICity) => {
      if (city.name.toLowerCase() === searchValue.toLowerCase()) {
        console.log("City found");
        continueValue(city.name);
        cityFound = true;
      }
    });

    if (!cityFound) {
      toast.error("City not found");
      cityFound = false;
    }
  };

  const continueValue = (city: string) => {
    activeCity$.set({
      name: city,
      coordinates: { lat: 0, lon: 0 },
    });
    addedCities$.push({
      name: city,
      population: 563311,
      coordinates: { lat: 51.0504, lon: 13.7373 },
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
        src="/assets/background.png"
        alt="background"
        className="absolute w-full h-full -z-10 object-cover"
        fill
      />
      <div id="styles-setup" className="mt-24 w-full flex justify-center">
        <Image
          className="transform bg-[#383b53] border-solid border-[#2d3142] border-8 border-r-0 pt-3 pb-3 pl-3 w-1/36"
          src="/assets/search1.png"
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
                      ? "block w-12+5/12 h-auto border-b-2 border-gray-400 text-amber-50 bg-[#383b53] p-5 hover: cursor-pointer "
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
      </div>

      <div className="relative mt-24 left-1/2 transform -translate-x-1/2  w-3/5 h-100% border-solid border-[#2d3142] border-8">
        <iframe
          id="map"
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5125429.316419938!2d10.415039000000002!3d51.151785999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sde!2sde!4v1679694749290!5m2!1sde!2sde"
          width="600"
          height="450"
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
        {searchValue.length > 0 ? (
          <button
            onClick={checkCity}
            className="absolute z-30 bottom-14 right-16 w-40 h-10 text-white bg-[#2d3142] rounded text-2xl hover:shadow-2xl transition duration-500 ease-in-out"
          >
            <p>{"Continue ->"}</p>
          </button>
        ) : null}
      </div>
    </>
  );
};

export default Search;
