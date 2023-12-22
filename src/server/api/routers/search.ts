import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import citiesJSON from "~/lib/city-list.json";
import { type ICity } from "~/types";
import { log } from "next-axiom";
import Fuse, { type IFuseOptions } from "fuse.js";

const cities = citiesJSON as ICity[];

export const searchRouter = createTRPCRouter({
  findCitiesByName: publicProcedure
    .input(
      z.object({
        name: z.string().min(0).max(70),
      }),
    )
    .query(({ input, ctx }) => {
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
        .map((result) => result.item);
    }),
  findCityById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ input, ctx }) => {
      log.info("User searched for city by id", {
        id: input.id,
        user: ctx.ip,
      });
      return { city: cities.find((city: ICity) => city.id === input.id) };
    }),
  findCityByName: publicProcedure
    .input(
      z.object({
        name: z.string().min(0).max(70),
      }),
    )
    .query(({ input, ctx }) => {
      log.info("User searched for city by name", {
        name: input.name,
        user: ctx.ip,
      });
      if (input.name.length === 0) return { city: undefined };
      return {
        city: cities.find(
          (city: ICity) => city.name.toLowerCase() === input.name.toLowerCase(),
        ),
      };
    }),
});
