import type {
  DocumentByInfo,
  NamedTableInfo,
  TableNamesInDataModel,
} from "convex/server";
import { v } from "convex/values";

import type { DataModel } from "./_generated/dataModel";
import admin1JSON from "../src/admin1.json";
import admin2JSON from "../src/admin2.json";
import { mutation, query } from "./_generated/server";

interface IAdminJSON {
  code: string;
  name: string;
}

type City = DocumentByInfo<
  NamedTableInfo<DataModel, TableNamesInDataModel<DataModel>>
>;

const admin1 = admin1JSON as IAdminJSON[];
const admin2 = admin2JSON as IAdminJSON[];

const addRegionToCity = (city: City) => {
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

export const findCitiesByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const cities = await ctx.db
      .query("search")
      .withSearchIndex("search_body", (q) => q.search("name", args.name))
      .take(5);

    const uniqueCities = cities
      .filter((city, index, self) => {
        return index === self.findIndex((c) => c.id === city.id);
      })
      .slice(0, 5);

    return uniqueCities.map(addRegionToCity);
  },
});

export const findCityById = query({
  args: { id: v.number() },
  handler: async (ctx, args) => {
    const city = await ctx.db
      .query("search")
      .withIndex("by_city_id", (q) => q.eq("id", args.id))
      .first();

    if (!city) {
      return null;
    }

    return addRegionToCity(city);
  },
});

// This is not the fastest way of doing this stuff,
// FIRST: We should use an index for both of the coord fields.
// I did this first, but because of the big size these indexes took, our convex db storage limit exceeded.
// In the future, if we have more storage, we should use indexes for coord fields.
// SECOND: Instead of a bounding box search, we could use something like geohashes to find all nearby cities more efficiently and quickly.
export const findNearestCityByCoord = mutation({
  args: { coord: v.object({ lat: v.number(), lng: v.number() }) },
  handler: async (ctx, args) => {
    // This is a simple query that finds cities within a 0.1-degree square; this optimization is to avoid scanning the whole table with havy calculations.
    const cities = await ctx.db
      .query("search")
      .filter((q) =>
        q.and(
          q.gt(q.field("coord.lon"), args.coord.lng - 0.1),
          q.lt(q.field("coord.lon"), args.coord.lng + 0.1),
          q.gt(q.field("coord.lat"), args.coord.lat - 0.1),
          q.lt(q.field("coord.lat"), args.coord.lat + 0.1),
        ),
      )
      .collect();

    // Find nearest city by calculating the distance between the given coord and the city's coord by using the haversine algorithm.
    let nearestCity: City | null = null;
    let nearestDistance = Infinity;
    for (const city of cities) {
      const cityCoord = city.coord;
      const lat1 = args.coord.lat;
      const lon1 = args.coord.lng;
      const lat2 = cityCoord.lat;
      const lon2 = cityCoord.lon;
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

    return addRegionToCity(nearestCity);
  },
});
