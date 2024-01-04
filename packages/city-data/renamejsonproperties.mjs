import fs from "fs";
import {z} from "zod";

// Replace 'input.json' with the path to your JSON file.
const filePath = "cities.json";
const newFilePath = "city-list.json";

export const citySchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    country: z.string(),
    admin1: z.string(),
    admin2: z.string(),
    lat: z.string(),
    lng: z.string(),
  }),
);

// Read the JSON file.
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    // Parse the JSON data.
    const jsonData = JSON.parse(data);
    const parsedJsonData = citySchema.parse(jsonData);

    // Make the lat and lng into coord and numbers and parse the id to a number. And delete lat and lng
    const updatedJsonData = parsedJsonData.map((city) => {
      const { lat, lng, ...rest } = city;
      return {
        ...rest,
        id: parseInt(city.id),
        coord: {
          lat: parseFloat(city.lat),
          lon: parseFloat(city.lng),
        },
      };
    });

    // Convert the updated JSON data back to a string.
    const updatedJson = JSON.stringify(updatedJsonData, null, 2);

    // Write the updated JSON back to the file.
    fs.writeFile(newFilePath, updatedJson, "utf8", (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
      } else {
        console.log(`Successfully wrote to the file: '${newFilePath}'`);
      }
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});
