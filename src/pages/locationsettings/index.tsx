import React, { useState, useEffect, useRef, type ChangeEvent } from "react";
import Layout from "~/components/Layout";
import { activeCity$ } from "~/states";
import Image from "next/image";
import { set } from "@legendapp/state/src/ObservableObject";

const LocationSettings = () => {
  interface ICity {
    name: string;
    population: number;
  }

  // Only for testing, later it will be fetched from an API. Now its the TestArray (data) with the cities and their population.
  const cities: ICity[] = [
    { name: "Berlin", population: 1000000 },
    { name: "Dresden", population: 510000 },
    { name: "Dortmund", population: 200000 },
    { name: "Dessau", population: 530000 },
    { name: "Döbeln", population: 50000 },
    { name: "Delb", population: 20000 },
  ];

  const [addedItems, setAddedItems] = useState<string[]>([]); // Will safe the cities their added in this array
  const [searchValue, setSearchValue] = useState(""); // SearchValue is the value of the input field
  const [searchValue2, setSearchValue2] = useState(""); // SearchValue2 is the value of the second input field
  const [activeInput, setActiveInput] = useState<string | null>(null); // activeInput is the input field which is active
  const firstInputRef = useRef<HTMLInputElement>(null); // firstInputRef is the ref of the first input field
  const secondInputRef = useRef<HTMLInputElement>(null); // secondInputRef is the ref of the first input field
  const [buttonName, setButtonName] = useState("Change Location"); // buttonName is the name of the first button
  const [secondButtonName, setsecondButtonName] = useState("Add New Location"); // buttonName is the name of the second button
  const saveButtonTextRef = useRef<HTMLButtonElement>(null); // saveButtonTextRef is the ref of the first button
  const saveButtonTextRef2 = useRef<HTMLButtonElement>(null); // saveButtonTextRef is the ref of the second button
  const [isLocationSelected, setIsLocationSelected] = useState(false); // isLocationSelected is true if the user selected a location (first input)
  const [isLocation2Selected, setIsLocation2Selected] = useState(false); // isLocation2Selected is true if the user selected a location (second input)

  //Animation for the changeButton
  useEffect(() => {
    if (saveButtonTextRef.current == undefined) return;
    if (buttonName === "Save changes") return;
    saveButtonTextRef.current.animate(
      {
        opacity: [0, 1],
      },
      {
        duration: 500,
      },
    );
  }, [buttonName]);

  // Animation for the AddButton
  useEffect(() => {
    if (saveButtonTextRef2.current == undefined) return;
    if (buttonName === "Save changes") return;
    saveButtonTextRef2.current.animate(
      {
        opacity: [0, 1],
      },
      {
        duration: 500,
      },
    );
  }, [secondButtonName]);

  // Will change button name to ChangeLocation if the first input field not empty
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setButtonName("Change Location");
    setSearchValue(event.target.value);
  };

  // Set the active input value to the input field which is active
  const handleInputFocus = (inputName: string) => {
    setActiveInput(inputName);
  };

  // Will set no active input if the user click outside the input field
  const handleInputBlur = () => {
    setActiveInput(null);
  };

  // Will set the value of the second input field to the city if the user click on a proposed city in the list
  const handleChange2 = (event: ChangeEvent<HTMLInputElement>) => {
    setsecondButtonName("Add New Location");
    setSearchValue2(event.target.value);
  };

  // Will focus the first input field if the user click on the change button
  const handleChangeclick = () => {
    if (searchValue === "") {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }
  };

  const handleChangeclick2 = () => {
    if (searchValue2 === "") {
      if (secondInputRef.current) {
        secondInputRef.current.focus();
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

  const checkCity2 = () => {
    cities.map(
      (stadt) => {
        if (stadt.name.toLowerCase() === searchValue2.toLowerCase()) {
          changed2(stadt.name);
        }
      },
      [searchValue2],
    );
  };

  // Will change the city
  const changed = (stadt: string) => {
    activeCity$.set(stadt);
    setButtonName("Changed");
    setsecondButtonName("Add New Location");
    setSearchValue("");
    setIsLocationSelected(false);
  };

  // Will add the city
  const changed2 = (stadt: string) => {
    if (!addedItems.includes(stadt)) {
      setAddedItems([...addedItems, stadt]);
    } else {
      alert("City already added");
    }
    setsecondButtonName("Added");
    setButtonName("Change Location");
    setSearchValue2("");
    setIsLocation2Selected(false);
  };

  // Will check if the user click on the change button or if he click on the city in the list
  const handleChangedown = () => {
    if (isLocationSelected === true) {
      changed(searchValue);
    } else {
      checkCity();
    }
  };

  // Will check if the user click on the change button or if he click on the city in the list
  const handleChangedown2 = () => {
    if (isLocation2Selected === true) {
      changed2(searchValue2);
    } else {
      checkCity2();
    }
  };

  // Will set the value of the first input field to the city if the user click on a proposed city in the list
  const handleStadtclick2 = (name: string) => {
    setSearchValue2(name);
    setIsLocation2Selected(true);
  };

  // Will set the value of the first input field to the city if the user click on a proposed city in the list
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
            <label className="mr-128 mb-2">Change location</label>
            <div className="flex w-full justify-center">
              <Image
                className="w-12 transform border-b-2 border-black bg-[#d8d5db] pb-3 pl-3 pt-3"
                src="/assets/search2.png"
                alt="search-icon"
                width={56}
                height={56}
              />
              <input
                ref={firstInputRef}
                className="w-4/12 border-b-2 border-black bg-[#d8d5db] pb-0.5 pl-3 pt-0.5 text-xl font-bold text-black outline-0"
                placeholder="Search for your location"
                type="text"
                onFocus={() => handleInputFocus("input1")}
                onChange={handleChange}
                value={searchValue}
                onBlur={handleInputBlur}
              />
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
                        activeInput !== "input1"
                          ? "hidden"
                          : "w-4/12+12px h-auto border-b-2 border-gray-400 bg-[#d8d5db] p-5"
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
            <button
              onClick={handleChangeclick}
              onMouseDown={handleChangedown}
              className="mt-2.5 rounded border-solid bg-[#2d3142] p-2 font-bold text-white"
              ref={saveButtonTextRef}
            >
              {buttonName}
            </button>
            <div />

            <div
              id="styles-setup"
              className="mt-9 flex w-full flex-col items-center"
            >
              <label className="mr-131 mb-2">Add new location</label>
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
                  value={searchValue2}
                  onBlur={handleInputBlur}
                  onChange={handleChange2}
                  ref={secondInputRef}
                />
              </div>{" "}
            </div>
            {cities.map((stadt) => {
              if (
                searchValue2 !== "" &&
                stadt.name.toLowerCase().startsWith(searchValue2.toLowerCase())
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
                      onMouseDown={() => handleStadtclick2(stadt.name)}
                    >
                      <p>
                        {stadt.name
                          .split("")
                          .map((buchstabe, buchstabenIndex) => (
                            <span
                              className={
                                buchstabenIndex < searchValue2.length
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
                {addedItems.map((city) => {
                  return (
                    <p className=" p-2  border border-solid border-black">
                      {city}
                    </p>
                  );
                })}
              </div>
            </div>
            <button
              onClick={handleChangeclick2}
              onMouseDown={handleChangedown2}
              className="mt-2.5 rounded border-solid bg-[#2d3142] p-2 font-bold text-white"
              ref={saveButtonTextRef2}
            >
              {secondButtonName}
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default LocationSettings;
