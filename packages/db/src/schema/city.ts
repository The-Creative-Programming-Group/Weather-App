import {
  index,
  integer,
  real,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { sqliteTable } from "./_table";

export const city = sqliteTable(
  "city",
  {
    id: integer("id").primaryKey({ autoIncrement: false }),
    region: text("region").notNull(),
    lat: real("lat").notNull(),
    lon: real("lon").notNull(),
    name: text("name").notNull(),
    germanName: text("german_name"),
    country: text("country").notNull(),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.name),
      germanNameIdx: index("german_name_idx").on(table.germanName),
      regionIdx: index("region_idx").on(table.region),
      latIdx: index("lat_idx").on(table.lat),
      lonIdx: index("lon_idx").on(table.lon),
      idIdx: uniqueIndex("id_idx").on(table.id),
    };
  },
);
