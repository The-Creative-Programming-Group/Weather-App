import fs from "fs";
import jsonlFile from "jsonl-db";
import { z } from "zod";

import admin1JSON from "./admin1.json";
import admin2JSON from "./admin2.json";

const citySchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  admin1: z.string(),
  admin2: z.string(),
  lat: z.string(),
  lng: z.string(),
});

const citiesSchema = z.array(citySchema);

const germanNamesSchema = z.array(
  z.object({
    geonameid: z.string(),
    isolanguage: z.string(),
    alternateName: z.string(),
    isPreferredName: z.string(),
  }),
);

const populationModifier = process.env.DEV_MODE === "true" ? 5000 : 1000;

const newCitySchema = z.object({
  name: z.string(),
  germanName: z.string().optional(),
  country: z.string(),
  region: z.string(),
  lat: z.number(),
  lon: z.number(),
});

const newCitiesSchema = z.array(newCitySchema);

interface IAdminJSON {
  code: string;
  name: string;
}

const admin1 = admin1JSON as IAdminJSON[];
const admin2 = admin2JSON as IAdminJSON[];

const addRegionToCity = (city: {
  id: number;
  admin1: string;
  admin2: string;
  lat: number;
  lon: number;
  country: string;
  name: string;
  germanName: string | undefined;
}): z.infer<typeof newCitySchema> => {
  const { admin1: _a1, admin2: _a2, id: _id, ...newCity } = city;
  if (city.admin1 === "" || city.country === "") {
    return {
      ...newCity,
      region: "",
    };
  }
  if (city.admin2 !== "") {
    const regionCode = city.country + "." + city.admin1 + "." + city.admin2;
    const region = admin2.find((region) => region.code === regionCode);

    if (!region) {
      const regionCode = city.country + "." + city.admin1;
      const region = admin1.find((region) => region.code === regionCode);

      return {
        ...newCity,
        region: region ? region.name : "",
      };
    }

    return {
      ...newCity,
      region: region ? region.name : "",
    };
  }
  const regionCode = city.country + "." + city.admin1;
  const region = admin1.find((region) => region.code === regionCode);

  return {
    ...newCity,
    region: region ? region.name : "",
  };
};

console.log(`Starting to format and optimize cities${populationModifier}.json`);

const cities = JSON.parse(
  fs.readFileSync(`./cities${populationModifier}.json`, "utf8"),
);
const germanNames = JSON.parse(fs.readFileSync("./DE.json", "utf8"));
const parsedCities = citiesSchema.parse(cities);
const parsedGermanNames = germanNamesSchema.parse(germanNames);

const germanNamesMap = new Map(
  parsedGermanNames.map((entry) => [entry.geonameid, entry]),
);

const updatedCities: z.infer<typeof newCitiesSchema> = parsedCities.map(
  (city) => {
    const germanNameEntry = germanNamesMap.get(city.id);
    const isGermanPreferredName =
      germanNameEntry?.isolanguage === "de" &&
      germanNameEntry?.isPreferredName === "1";

    const { lng: _lng, ...newCity } = city;

    return addRegionToCity({
      ...newCity,
      germanName: isGermanPreferredName
        ? germanNameEntry.alternateName
        : undefined,
      id: parseInt(city.id),
      lat: parseFloat(city.lat),
      lon: parseFloat(city.lng),
    });
  },
);

const cityJsonlFile = jsonlFile("cities.jsonl");

await cityJsonlFile.addMany(updatedCities);

console.log(`Done formatting and optimizing cities${populationModifier}.json`);
