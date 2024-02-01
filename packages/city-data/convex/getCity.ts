import type {
  DocumentByInfo,
  NamedTableInfo,
  TableNamesInDataModel,
} from "convex/server";
import { v } from "convex/values";

import type { DataModel } from "./_generated/dataModel";
import admin1JSON from "../src/admin1.json";
import admin2JSON from "../src/admin2.json";
import { query } from "./_generated/server";

interface IAdminJSON {
  code: string;
  name: string;
}

const admin1 = admin1JSON as IAdminJSON[];
const admin2 = admin2JSON as IAdminJSON[];

const addRegionToCity = (
  city: DocumentByInfo<
    NamedTableInfo<DataModel, TableNamesInDataModel<DataModel>>
  >,
) => {
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

    return cities.map(addRegionToCity);
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
