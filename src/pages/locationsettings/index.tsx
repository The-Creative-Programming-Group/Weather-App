import React, { useState, useEffect } from "react";
import Layout from "~/components/Layout";

const index = () => {
  interface IStadt {
    name: string;
    population: number;
  }

  const städte = [
    { name: "Berlin", population: 1000000 },
    { name: "Dresden", population: 510000 },
    { name: "Dortmund", population: 200000 },
    { name: "Dessau", population: 530000 },
    { name: "Döbeln", population: 50000 },
    { name: "Delb", population: 20000 },
  ];
  const [searchValue, setSearchValue] = useState("");
  const [searchValue2, setSearchValue2] = useState("");
  const [activeInput, setActiveInput] = useState(null);

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleInputFocus = (inputName) => {
    setActiveInput(inputName);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  const handleChange2 = (event) => {
    setSearchValue2(event.target.value);
  };

  let anzahl = 0;
  städte.sort((stadtA, stadtB) => stadtB.population - stadtA.population);

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
              <img
                className="w-12 transform border-b-2 border-black bg-[#d8d5db] pt-3 pb-3 pl-3"
                src="assets/search2.png"
                alt="search-icon"
                width={56}
                height={56}
              />
              <input
                className="w-4/12 border-b-2 border-black bg-[#d8d5db] pt-0.5 pb-0.5 pl-3 text-xl font-bold text-black outline-0"
                placeholder="Search for your location"
                type="text"
                onFocus={() => handleInputFocus("input1")}
                onChange={handleChange}
                value={searchValue}
                onBlur={handleInputBlur}
              />
            </div>
            {städte.map((stadt) => {
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
                          : "h-auto w-4/12+12px border-b-2 border-gray-400 bg-[#d8d5db] p-5"
                      }
                      key={stadt.name}
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
            <div />

            <div
              id="styles-setup"
              className="mt-9 flex w-full flex-col items-center"
            >
              <label className="mr-131 mb-2">Add new location</label>
              <div className="flex w-full justify-center">
                <img
                  className="w-12 transform border-b-2 border-black bg-[#d8d5db] pt-3 pb-3 pl-3"
                  src="assets/search2.png"
                  alt="search-icon"
                  width={56}
                  height={56}
                />
                <input
                  className="w-4/12 border-b-2 border-black bg-[#d8d5db] pt-0.5 pb-0.5 pl-3 text-xl font-bold text-black outline-0"
                  placeholder="Search for your location"
                  type="text"
                  onFocus={() => handleInputFocus("input2")}
                  value={searchValue2}
                  onBlur={handleInputBlur}
                  onChange={handleChange2}
                />
              </div>{" "}
            </div>
            {städte.map((stadt) => {
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
                          : "h-auto w-4/12+12px border-b-2 border-gray-400 bg-[#d8d5db] p-5"
                      }
                      key={stadt.name}
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
          </div>
        </div>
      </Layout>
    </>
  );
};

export default index;
