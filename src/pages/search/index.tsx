import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { activeCity$, addedCities$ } from "~/states";
import { toast, ToastContainer } from "react-toastify";
import search1Image from "~/assets/search1.png";
import background from "~/assets/background.png";
import citiesJSON from "~/lib/city-list.json";
import "react-toastify/dist/ReactToastify.css";
import { ICity } from "~/types";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const cities = citiesJSON as ICity[];

const Search = () => {
  const router = useRouter();
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

  const { t: translationCommon } = useTranslation("common");
  const { t: translationSearch } = useTranslation("search");
  const { t: translationLocationSettings } = useTranslation("locationsettings");

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

  return (
    <>
      <ToastContainer />
      <Head>
        <title>{translationCommon("search page title")}</title>
        <meta name="description" content="An faboulus weather website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        src={background}
        alt="background"
        className="absolute -z-10 h-full w-full object-cover"
        fill
      />
      <div id="styles-setup" className="mt-80 flex w-full justify-center">
        <Image
          className="w-1/36 transform border-8 border-r-0 border-solid border-[#2d3142] bg-[#383b53] pb-3 pl-3 pt-3"
          src={search1Image}
          alt="search-icon"
          width={56}
          height={56}
        />

        <input
          className="w-5/12 border-8 border-l-0 border-solid border-[#2d3142] bg-[#383b53] pb-0.5 pl-3 pt-0.5 text-xl text-white outline-0"
          autoFocus
          placeholder={translationSearch("search input placeholder")}
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
              if (searchValue.id !== 0 && searchValue.country !== "") {
                city = cities.find((city: ICity) => city.id === searchValue.id);
              } else {
                city = cities.find(
                  (city: ICity) =>
                    city.name.toLowerCase() === searchValue.name.toLowerCase(),
                );
              }
              if (city) {
                if (
                  addedCities$
                    .get()
                    .find((value: ICity) => value.id === city!.id)
                ) {
                  activeCity$.set(city);
                  router.push("/home");
                } else {
                  addedCities$.push(city);
                  activeCity$.set(city);
                  router.push("/home");
                }
              } else {
                toast.error(
                  translationLocationSettings("city not found toast"),
                );
              }
            }
          }}
        />
      </div>
      <div className="flex flex-col items-center">
        {results.map((city: ICity) => {
          if (
            isInputActive &&
            city.name.toLowerCase().startsWith(searchValue.name.toLowerCase())
          ) {
            return (
              <div
                className={
                  isInputActive
                    ? "z-20 flex h-auto w-12+5/12 cursor-pointer justify-between border-b-2 border-gray-400 bg-[#383b53] p-5 text-amber-50"
                    : "hidden"
                }
                key={city.id}
                onMouseDown={() => {
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
        <div className="absolute left-1/2 mt-24 h-96 w-full -translate-x-1/2 transform">
          {searchValue.name.length > 0 ? (
            <button
              onClick={() => {
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
                    router.push("/home");
                  } else {
                    addedCities$.push(city);
                    activeCity$.set(city);
                    router.push("/home");
                  }
                } else {
                  toast.error(
                    translationLocationSettings("city not found toast"),
                  );
                }
              }}
              className="absolute bottom-14 right-16 z-10 h-12 w-44 rounded bg-[#2d3142] text-2xl text-white transition duration-500 ease-in-out hover:shadow-2xl"
            >
              <p>{translationSearch("continue button")}</p>
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "search",
        "locationsettings",
      ])),
    },
  };
}

export default Search;
