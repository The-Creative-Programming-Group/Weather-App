import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  search: defineTable({
    admin1: v.string(),
    admin2: v.string(),
    coord: v.object({ lat: v.float64(), lon: v.float64() }),
    country: v.string(),
    id: v.float64(),
    name: v.string(),
  })
    .searchIndex("search_body", {
      searchField: "name",
    })
    .index("by_city_id", ["id"]),
});
