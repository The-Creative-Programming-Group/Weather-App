import type {
  DocumentByInfo,
  NamedTableInfo,
  TableNamesInDataModel,
} from "convex/server";
import { v } from "convex/values";

import type { DataModel } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

type City = DocumentByInfo<
  NamedTableInfo<DataModel, TableNamesInDataModel<DataModel>>
>;

export const findCitiesByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return [
      ...(await ctx.db
        .query("search")
        .withSearchIndex("search_by_german_name_idx", (q) =>
          q.search("germanName", args.name),
        )
        .take(1)),
      ...(await ctx.db
        .query("search")
        .withSearchIndex("search_by_name_idx", (q) =>
          q.search("name", args.name),
        )
        .take(5)),
    ];
  },
});

export const findCityById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const cityId = ctx.db.normalizeId("search", args.id);
    if (cityId === null) return null;
    return await ctx.db.get(cityId);
  },
});

// This is not the fastest way of doing this stuff,
// instead of a bounding box search, we could use something like geohashes to find all nearby cities more efficiently and quickly.
export const findNearestCityByCoord = mutation({
  args: { coord: v.object({ lat: v.number(), lon: v.number() }) },
  handler: async (ctx, args) => {
    const citiesInBoundingBox = await ctx.db
      .query("search")
      .withIndex("lon_idx", (q) =>
        q.gt("lon", args.coord.lon - 0.1).lt("lon", args.coord.lon + 0.1),
      )
      .filter((q) =>
        q.and(
          q.gt(q.field("lat"), args.coord.lat - 0.1),
          q.lt(q.field("lat"), args.coord.lat + 0.1),
        ),
      )
      .collect();

    let nearestCity: City | null = null;
    let nearestDistance = Infinity;
    for (const city of citiesInBoundingBox) {
      const lat1 = args.coord.lat;
      const lon1 = args.coord.lon;
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

      return nearestCity;
    }
  },
});
