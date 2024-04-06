import fs from "fs";
import readline from "readline";
import jsonfile from "jsonfile";
import { z } from "zod";

import admin1JSON from "../src/admin1.json";
import admin2JSON from "../src/admin2.json";
import { newCitySchema } from "./push-city-data.js";

export const citySchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  admin1: z.string(),
  admin2: z.string(),
  lat: z.string(),
  lng: z.string(),
});

export const citiesSchema = z.array(citySchema);

export const germanNamesSchema = z.array(
  z.object({
    geonameid: z.string(),
    isolanguage: z.string(),
    alternateName: z.string(),
    isPreferredName: z.string(),
  }),
);

interface IAdminJSON {
  code: string;
  name: string;
}

const admin1 = admin1JSON as IAdminJSON[];
const admin2 = admin2JSON as IAdminJSON[];

const addRegionToCity = (city: {
  id: number;
  admin1: string;
  admin2: string;
  lat: number;
  lon: number;
  country: string;
  name: string;
  germanName: string | undefined;
}) => {
  if (city.admin1 === "" || city.country === "") {
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
  const { admin1: _a1, admin2: _a2, ...newCity } = city;
  return {
    ...newCity,
    region: region ? region.name : "",
  };
};

const removeDoubleQuotes = (value: string) => value.replaceAll('"', "");

type Entry = Record<string, string>;

const txtToJson = (
  filename: string,
  columnNameMapping: Record<number, string> = {},
  jsonFilePath: jsonfile.Path,
) => {
  return new Promise<void>((resolve, reject) => {
    console.log(
      `Converting ${filename}.txt to ${JSON.stringify(jsonFilePath)}`,
    );
    const txtFilePath = `./${filename}.txt`;
    jsonFilePath = jsonFilePath || `./${filename}.json`;
    const entries: Entry[] = [];
    let i = 0;
    let lineValues;
    const mappedColumnIndexes = Object.keys(columnNameMapping).map((index) =>
      parseInt(index),
    );

    readline
      .createInterface({
        input: fs.createReadStream(txtFilePath),
        output: process.stdout,
        terminal: false,
      })
      .on("line", function (line) {
        lineValues = line.split("\t");
        if (i !== 0) {
          entries.push(
            lineValues.reduce((entry: Entry, value, valueIndex) => {
              if (mappedColumnIndexes.includes(valueIndex)) {
                const key = columnNameMapping[valueIndex];
                if (key !== undefined) {
                  entry[key] = removeDoubleQuotes(value);
                }
              }

              return entry;
            }, {}),
          );
        }
        i++;
      })
      .on("close", function () {
        console.log(`Writing ${i} entries to ${JSON.stringify(jsonFilePath)}`);
        jsonfile.writeFile(
          jsonFilePath,
          entries,
          { spaces: 2 },
          function (err) {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve();
            }
          },
        );
      });
  });
};

// geonameid         : integer id of record in geonames database
// name              : name of geographical point (utf8) varchar(200)
// asciiname         : name of geographical point in plain ascii characters, varchar(200)
// alternatenames    : alternatenames, comma separated, ascii names automatically transliterated, convenience attribute from alternatename table, varchar(10000)
// latitude          : latitude in decimal degrees (wgs84)
// longitude         : longitude in decimal degrees (wgs84)
// feature class     : see http://www.geonames.org/export/codes.html, char(1)
// feature code      : see http://www.geonames.org/export/codes.html, varchar(10)
// country code      : ISO-3166 2-letter country code, 2 characters
// cc2               : alternate country codes, comma separated, ISO-3166 2-letter country code, 200 characters
// admin1 code       : fipscode (subject to change to iso code), see exceptions below, see file admin1Codes.txt for display names of this code; varchar(20)
// admin2 code       : code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80)
// admin3 code       : code for third level administrative division, varchar(20)
// admin4 code       : code for fourth level administrative division, varchar(20)
// population        : bigint (8 byte int)
// elevation         : in meters, integer
// dem               : digital elevation model, srtm3 or gtopo30, average elevation of 3''x3'' (ca 90mx90m) or 30''x30'' (ca 900mx900m) area in meters, integer. srtm processed by cgiar/ciat.
// timezone          : the iana timezone id (see file timeZone.txt) varchar(40)
// modification date : date of last modification in yyyy-MM-dd format
void Promise.all([
  txtToJson(
    "cities1000",
    {
      0: "id",
      8: "country",
      1: "name",
      4: "lat",
      5: "lng",
      10: "admin1",
      11: "admin2",
    },
    "./cities.json",
  ),

  txtToJson(
    "admin1CodesASCII",
    {
      0: "code",
      1: "name",
    },
    "./admin1.json",
  ),

  txtToJson(
    "admin2Codes",
    {
      0: "code",
      1: "name",
    },
    "./admin2.json",
  ),

  txtToJson(
    "DE",
    {
      0: "alternateNameId",
      1: "geonameid",
      2: "isolanguage",
      3: "alternateName",
      4: "isPreferredName",
      5: "isShortName",
      6: "isColloquial",
      7: "isHistoric",
      8: "from",
      9: "to",
    },
    "./DE.json",
  ),
]).then(() => {
  console.log("Done creating JSON files");

  console.log("Starting to format and optimize cities.json");

  const cities = JSON.parse(fs.readFileSync("./cities.json", "utf8"));
  const germanNames = JSON.parse(fs.readFileSync("./DE.json", "utf8"));
  const parsedCities = citiesSchema.parse(cities);
  const parsedGermanNames = germanNamesSchema.parse(germanNames);

  const updatedCities: z.infer<typeof newCitySchema> = parsedCities.map(
    (city) => {
      const germanNameEntry = parsedGermanNames.find(
        (entry) =>
          entry.geonameid === city.id &&
          entry.isolanguage === "de" &&
          entry.isPreferredName === "1",
      );
      return addRegionToCity({
        ...city,
        germanName: germanNameEntry?.alternateName,
        id: parseInt(city.id),
        lat: parseFloat(city.lat),
        lon: parseFloat(city.lng),
      });
    },
  );

  // Write the updated cities back to the cities.json file
  fs.writeFileSync(
    "./cities.json",
    JSON.stringify(updatedCities, null, 2),
    "utf8",
  );

  console.log("Done formatting and optimizing cities.json");
});
