import { z } from "zod";

import type { InferSelectModel } from "@weatherio/db";
import { and, between, schema } from "@weatherio/db";

import { createTRPCRouter, rateLimitedProcedure } from "../trpc";

type City = InferSelectModel<typeof schema.city>;

export const searchRouter = createTRPCRouter({
  findCityById: rateLimitedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.query.city.findFirst({
        where: (users, { eq }) => eq(users.id, input.id),
      });
    }),

  // For now, its not fuzzy search, but we can implement this in the future. For now, it just would be too much work.
  findCitiesByName: rateLimitedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.query.city.findMany({
        limit: 5,
        where: (users, { like, or }) =>
          or(
            or(
              like(users.name, input.name + "%"),
              like(users.name, "%" + input.name),
            ),
            or(
              like(users.germanName, input.name + "%"),
              like(users.germanName, "%" + input.name),
            ),
            or(
              like(users.region, input.name + "%"),
              like(users.region, "%" + input.name),
            ),
          ),
      });
    }),

  // This is not the fastest way of doing this stuff, instead of a bounding box search, we could use something like geohashes to find all nearby cities more efficiently and quickly.
  findNearestCityByCoord: rateLimitedProcedure
    .input(
      z.object({
        coord: z.object({
          lat: z.number(),
          lon: z.number(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const cities = await ctx.db
        .select()
        .from(schema.city)
        .where(
          and(
            between(
              schema.city.lon,
              input.coord.lon - 0.1,
              input.coord.lon + 0.1,
            ),
            between(
              schema.city.lat,
              input.coord.lat - 0.1,
              input.coord.lat + 0.1,
            ),
          ),
        );

      // Find nearest city by calculating the distance between the given coord and the city's coord by using the haversine algorithm.
      let nearestCity: City | null = null;
      let nearestDistance = Infinity;
      for (const city of cities) {
        const lat1 = input.coord.lat;
        const lon1 = input.coord.lon;
        const lat2 = city.lat;
        const lon2 = city.lon;
        const R = 6371e3; // metres
        const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // in metres

        if (distance < nearestDistance) {
          nearestCity = city;
          nearestDistance = distance;
        }
      }

      if (!nearestCity) {
        return null;
      }

      return nearestCity;
    }),
});
