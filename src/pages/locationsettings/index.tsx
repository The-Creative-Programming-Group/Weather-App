import React, { useState, useRef, type ChangeEvent } from "react";
import Layout from "~/components/Layout";
import {activeCity$, addedCities$} from "~/states";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { observer } from "@legendapp/state/react-components";
import {cities, ICity} from "~/testdata";

const LocationSettings = observer(() => {
  type ButtonNameType = "Add New Location" | "Added";

  const [searchValue, setSearchValue] = useState(""); // searchValue is the value of the input field
  const [activeInput, setActiveInput] = useState<string | null>(null); // activeInput is the input field that is active
  const inputRef = useRef<HTMLInputElement>(null); // inputRef is the ref of the input field
  const [buttonName, setButtonName] =
    useState<ButtonNameType>("Add New Location"); // buttonName is the name of the first button
  const saveButtonTextRef = useRef<HTMLButtonElement>(null); // saveButtonTextRef is the ref of the first button

  // Will change button name to ChangeLocation if the first input field not empty
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setButtonName("Add New Location");
    setSearchValue(event.target.value);
  };

  const connect = (city: ICity) => {
    activeCity$.set({
      name: city.name,
      coordinates: { lat: city.coordinates.lat, lon: city.coordinates.lon },
    });
  };

  // Will close the Elements
  const removeElement = (city: ICity) => {
    if (addedCities$.get().includes(city)) {
      activeCity$.set(null);
      addedCities$.set(addedCities$.get().filter((item) => item !== city));
    }
  };

  // Set the active input value to the input field which is active
  const handleInputFocus = (inputName: string) => {
    setActiveInput(inputName);
  };

  // Will set no active input if the user clicks outside the input field
  const handleInputBlur = () => {
    setActiveInput(null);
  };

  // Will focus the first input field if the user clicks on the change button
  const handleChangeclick = () => {
    if (searchValue === "") {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Will check if the city is in the array and will change the city if it is in the array
  const checkCity = () => {
    cities.map(
      (city: ICity) => {
        if (city.name.toLowerCase() === searchValue.toLowerCase()) {
          changed(city);
        }
      },
      [searchValue],
    );
  };

  // Will add the city
  const changed = (stadt: ICity) => {
    if (!addedCities$.get().includes(stadt)) {
      addedCities$.push(stadt);
      activeCity$.set({ name: stadt.name, coordinates: stadt.coordinates });
      setButtonName("Added");
    } else {
      alert("City already added");
    }
    setSearchValue("");
  };

  // Will set the value of the first input field to the city if the user clicks on a proposed city in the list
  const handleStadtclick = (name: string) => {
    setSearchValue(name);
  };

  // Sort the cities by population
  let anzahl = 0;
  cities.sort((cityA: ICity, cityB: ICity) => cityB.population - cityA.population);

  return (
    <>
      <Layout title={"Location Settings"}>
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
                  src="/assets/search2.png"
                  alt="search-icon"
                  width={56}
                  height={56}
                />
                <input
                  className="w-4/12 border-b-2 border-black bg-[#d8d5db] pb-0.5 pl-3 pt-0.5 text-xl font-bold text-black outline-0"
                  placeholder="Search for your location"
                  type="text"
                  onFocus={() => handleInputFocus("input2")}
                  value={searchValue}
                  onBlur={handleInputBlur}
                  onChange={handleChange}
                  ref={inputRef}
                />
              </div>{" "}
            </div>
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
                          ? "w-4/12+12px h-auto border-b-2 border-gray-400 bg-[#d8d5db] p-5 hover: cursor-pointer"
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
                    </div>
                  );
                }
              }
            })}
            <div className="w-full flex justify-center mt-2">
              <div className=" w-4/12+12px block">
                {addedCities$.get().map((city: ICity) => {
                  return (
                    <div
                      onClick={() => {
                        connect(city);
                      }}
                      className={
                        activeCity$.name.get() === city.name
                          ? "bg-[#d8d5db] p-2 border-2 border-black mt-2 hover: cursor-pointer flex justify-between"
                          : "bg-[#d8d5db] p-2 border border-solid border-black mt-2 hover: cursor-pointer flex justify-between"
                      }
                      key={city.name}
                    >
                      <p className="">{city.name}</p>
                      <div className="flex">
                        <RxCross2
                          onClick={() => removeElement(city)}
                          className="mr-5 mt-1"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              onClick={handleChangeclick}
              onMouseDown={checkCity}
              className="mt-2.5 rounded border-solid bg-[#2d3142] p-2 font-bold text-white"
              ref={saveButtonTextRef}
            >
              {buttonName}
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
});

export default LocationSettings;
