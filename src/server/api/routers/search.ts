import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import citiesJSON from "~/lib/city-list.json";
import { type ICity } from "~/types";
import { log } from "next-axiom";

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
      return cities
        .filter((city: ICity) =>
          city.name.toLowerCase().includes(input.name.toLowerCase()),
        )
        .slice(0, 4);
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
