import React, { useState, useEffect, useRef, type ChangeEvent } from "react";
import Layout from "~/components/Layout";
import { activeCity$, addedCities$ } from "~/states";
import Image from "next/image";

const LocationSettings = () => {
  interface ICity {
    name: string;
    population: number;
  }

  // Only for testing, later it will be fetched from an API. Now its TestArray (data) with the cities and their population.
  const cities: ICity[] = [
    { name: "Berlin", population: 1000000 },
    { name: "Dresden", population: 510000 },
    { name: "Dortmund", population: 200000 },
    { name: "Dessau", population: 530000 },
    { name: "Döbeln", population: 50000 },
    { name: "Delb", population: 20000 },
  ];

  type ButtonNameType = "Add New Location" | "Added";

  const [searchValue, setSearchValue] = useState(""); // SearchValue2 is the value of the second input field
  const [activeInput, setActiveInput] = useState<string | null>(null); // activeInput is the input field which is active
  const InputRef = useRef<HTMLInputElement>(null); // firstInputRef is the ref of the first input field
  const [buttonName, setButtonName] =
    useState<ButtonNameType>("Add New Location"); // buttonName is the name of the first button
  const saveButtonTextRef = useRef<HTMLButtonElement>(null); // saveButtonTextRef is the ref of the first button
  const [isLocationSelected, setIsLocationSelected] = useState(false); // isLocationSelected is true if the user selected a location (first input)

  // Will change button name to ChangeLocation if the first input field not empty
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setButtonName("Add New Location");
    setSearchValue(event.target.value);
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
      if (InputRef.current) {
        InputRef.current.focus();
      }
    }
  };

  // Will check if the city is in the array and will change the city if it is in the array
  const checkCity = () => {
    cities.map(
      (stadt) => {
        if (stadt.name.toLowerCase() === searchValue.toLowerCase()) {
          changed(stadt.name);
        }
      },
      [searchValue],
    );
  };

  // Will add the city
  const changed = (stadt: string) => {
    if (!addedCities$.get().includes(stadt)) {
      addedCities$.push(stadt);
      setButtonName("Added");
    } else {
      alert("City already added");
    }
    setSearchValue("");
    setIsLocationSelected(false);
  };

  // Will check if the user clicks on the change button or if he clicks on the city in the list
  const handleChangedown = () => {
    if (isLocationSelected === true) {
      changed(searchValue);
    } else {
      checkCity();
    }
  };

  // Will set the value of the first input field to the city if the user clicks on a proposed city in the list
  const handleStadtclick = (name: string) => {
    setSearchValue(name);
    setIsLocationSelected(true);
  };

  // Sort the cities by population
  let anzahl = 0;
  cities.sort((stadtA, stadtB) => stadtB.population - stadtA.population);

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
                  ref={InputRef}
                />
              </div>{" "}
            </div>
            {cities.map((stadt) => {
              if (
                searchValue !== "" &&
                stadt.name.toLowerCase().startsWith(searchValue.toLowerCase())
              ) {
                anzahl++;

                if (anzahl <= 4) {
                  return (
                    <div
                      className={
                        activeInput !== "input2"
                          ? "hidden"
                          : "w-4/12+12px h-auto border-b-2 border-gray-400 bg-[#d8d5db] p-5 hover: cursor-pointer"
                      }
                      key={stadt.name}
                      onMouseDown={() => handleStadtclick(stadt.name)}
                    >
                      <p>
                        {stadt.name
                          .split("")
                          .map((buchstabe, buchstabenIndex) => (
                            <span
                              className={
                                buchstabenIndex < searchValue.length
                                  ? "font-bold"
                                  : ""
                              }
                              key={buchstabenIndex}
                            >
                              {buchstabe}
                            </span>
                          ))}
                      </p>
                    </div>
                  );
                }
              }
            })}
            <div className="w-full flex justify-center mt-4">
              <div className="  bg-[#d8d5db] w-4/12+12px block">
                {addedCities$.get().map((city: string) => {
                  return (
                    <p className=" p-2  border border-solid border-black">
                      {city}
                    </p>
                  );
                })}
              </div>
            </div>
            <button
              onClick={handleChangeclick}
              onMouseDown={handleChangedown}
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
};

export default LocationSettings;
