import type { IFuseOptions } from "fuse.js";
import citiesJSON from "@weatherio/city-data";
import admin1JSON from "@weatherio/city-data/admin1";
import admin2JSON from "@weatherio/city-data/admin2";
import { type ICity } from "@weatherio/types";
import Fuse from "fuse.js";
import { log } from "next-axiom";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

interface ICityJSON {
  id: number;
  name: string;
  admin1: string;
  admin2: string;
  country: string;
  coord: {
    lon: number;
    lat: number;
  };
}

interface IAdminJSON {
  code: string;
  name: string;
}

const cities = citiesJSON as ICityJSON[];
const admin1 = admin1JSON as IAdminJSON[];
const admin2 = admin2JSON as IAdminJSON[];

const addRegionToCity = (city: ICityJSON): ICity => {
  if (city.admin1 === "" || city.country === "") {
    console.log(city);
    return {
      ...city,
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
        ...city,
        region: region ? region.name : "",
      };
    }

    return {
      ...city,
      region: region ? region.name : "",
    };
  }
  const regionCode = city.country + "." + city.admin1;
  const region = admin1.find((region) => region.code === regionCode);

  return {
    ...city,
    region: region ? region.name : "",
  };
};

export const searchRouter = createTRPCRouter({
  findCitiesByName: publicProcedure
    .input(
      z.object({
        name: z.string().min(0).max(70),
      }),
    )
    .query(({ input, ctx }): ICity[] => {
      log.info("User searched for cities", {
        name: input.name,
        user: ctx.ip,
      });
      if (input.name.length === 0) return [];
      const options: IFuseOptions<(typeof cities)[number]> = {
        keys: ["name"], // specify the property to search
        threshold: 0.6,
        isCaseSensitive: false,
        shouldSort: true,
      };

      const fuse = new Fuse(cities, options);

      return fuse
        .search(input.name)
        .slice(0, 5)
        .map((result) => addRegionToCity(result.item));
    }),
  findCityById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ input, ctx }): { city: ICity | undefined } => {
      log.info("User searched for city by id", {
        id: input.id,
        user: ctx.ip,
      });
      const city = cities.find((city) => city.id === input.id);
      if (!city) return { city: undefined };
      return { city: addRegionToCity(city) };
    }),
  findCityByName: publicProcedure
    .input(
      z.object({
        name: z.string().min(0).max(70),
      }),
    )
    .query(({ input, ctx }): { city: undefined | ICity } => {
      log.info("User searched for city by name", {
        name: input.name,
        user: ctx.ip,
      });
      if (input.name.length === 0) return { city: undefined };
      const city = cities.find(
        (city: ICityJSON) =>
          city.name.toLowerCase() === input.name.toLowerCase(),
      );
      if (!city) return { city: undefined };
      return { city: addRegionToCity(city) };
    }),
});
