import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  search: defineTable({
    country: v.string(),
    germanName: v.optional(v.string()),
    lat: v.float64(),
    lon: v.float64(),
    name: v.string(),
    region: v.string(),
  })
    .searchIndex("search_by_name_idx", {
      searchField: "name",
    })
    .searchIndex("search_by_german_name_idx", {
      searchField: "germanName",
    })
    .index("lon_idx", ["lon"]),
});
