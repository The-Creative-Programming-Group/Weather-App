import fs from "fs";
import { z } from "zod";

import { db, schema } from "@weatherio/db";

const filePathCities = "src/cities.json";

export const newCitySchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    germanName: z.string().optional(),
    country: z.string(),
    region: z.string(),
    lat: z.number(),
    lon: z.number(),
  }),
);

try {
  console.time("time");
  const data = await fs.promises.readFile(filePathCities, "utf8");

  // Parse the JSON data.
  const jsonData = JSON.parse(data);
  const parsedJsonData = newCitySchema.parse(jsonData);

  await db.delete(schema.city).all();

  const chunkSize = 2000;
  const promises = [];

  for (let i = 0; i < parsedJsonData.length; i += chunkSize) {
    const chunk = parsedJsonData.slice(i, i + chunkSize);
    promises.push(db.insert(schema.city).values(chunk));
  }

  await Promise.all(promises);
  console.timeEnd("time");
} catch (error) {
  console.error("Error:", error);
}
