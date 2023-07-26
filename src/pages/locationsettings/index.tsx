import React, { useState } from "react";
import Layout from "~/components/Layout";

const index = () => {
  const städte = ["London", "Paris", "Dresden", "Dortmund", "Dessau" , "Deld", "Droben" ,"Radebeul", "Donau", "Döbeln", "Desso", "Delta", "Derto", "Dorbitz"];
  const [searchValue, setSearchValue] = useState("");

  const  handleChange = (event)  => {
    setSearchValue(event.target.value);
  };

  let anzahl = 0;

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
            <label className="mr-131 mb-2">Change location</label>
            <div className="flex w-full justify-center">
              <img
                className="w-12 transform bg-[#d8d5db] border-b-2 border-black pt-3 pb-3 pl-3"
                src="assets/search2.png"
                alt="search-icon"
                width={56}
                height={56}
              />
              <input
                className="w-4/12 bg-[#d8d5db] border-b-2 border-black pt-0.5 pb-0.5 pl-3 text-xl font-bold text-black outline-0"
                placeholder="Search for your location"
                type="text"
                onChange={handleChange}
                value={searchValue}

              />
            </div>
              {städte.map((stadt) => {
                if (searchValue !== "" && stadt.toLowerCase().startsWith(searchValue.toLowerCase())) {
                  anzahl++;

                  if (anzahl <= 4) {
                    return (
                        <div className="w-4/12+12px p-5 bg-[#d8d5db] border-b-2 border-gray-400 h-auto" key={stadt}>
                          <p>
                            {stadt.split("").map((buchstabe, buchstabenIndex) => (
                                <span className={buchstabenIndex < searchValue.length ? "font-bold" : ""}>
                                {buchstabe}
                                 </span>
                            ))}
                          </p>
                        </div>
                    );
                  }
                }
              })}

            <div
              id="styles-setup"
              className="mt-9 flex w-full flex-col items-center"
            >
              <label className="mr-131 mb-2">Add new location</label>
              <div className="flex w-full justify-center">
                <img
                  className="w-12 transform bg-[#d8d5db] pt-3 pb-3 pl-3"
                  src="assets/search2.png"
                  alt="search-icon"
                  width={56}
                  height={56}
                />
                <input
                  className="w-4/12 bg-[#d8d5db] pt-0.5 pb-0.5 pl-3 text-xl font-bold text-black outline-0"
                  placeholder="Search for your location"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default index;
