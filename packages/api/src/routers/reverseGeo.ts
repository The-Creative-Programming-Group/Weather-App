import { log } from "next-axiom";
import { z } from "zod";

import type { ICity } from "@weatherio/types";

import { env } from "../../env.mjs";
import { createTRPCRouter, rateLimitedProcedure } from "../trpc";

const reverseGeoSchema = z.array(
  z.object({
    name: z.string(),
    country: z.string(),
    state: z.string().optional(),
  }),
);

type ReverseGeo = z.infer<typeof reverseGeoSchema> | undefined;

async function generateId(object: ReverseGeo): Promise<number> {
  const str = JSON.stringify(object);
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  // Use the SubtleCrypto API to generate the hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return parseInt(hashHex, 16);
}

export const reverseGeoRouter = createTRPCRouter({
  getCity: rateLimitedProcedure
    .input(
      z.object({
        coordinates: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
      }),
    )
    .mutation(async ({ input }): Promise<ICity | undefined> => {
      log.info("User requested location data for coordinates", {
        coordinates: input.coordinates,
      });

      const urlReverseGeo = `https://api.api-ninjas.com/v1/reversegeocoding?lat=${input.coordinates.lat.toString()}&lon=${input.coordinates.lng.toString()}`;

      let reverseGeoData: ReverseGeo = undefined;

      try {
        const reverseGeoResult = await fetch(urlReverseGeo, {
          headers: {
            "X-Api-Key": `${env.API_NINJA_API_KEY}`,
          },
        });
        /* log.debug("Reverse geocoding data", {
                    data: (reverseGeoResult).data,
                }); */
        reverseGeoData = reverseGeoSchema.parse(await reverseGeoResult.json());
      } catch (error) {
        if (error instanceof z.ZodError) {
          log.error("Zod Errors", error.issues);
        } else {
          log.error("Error while fetching reverse geocoding data", {
            error: error,
          });
        }
      }

      // Return if no data
      if (!reverseGeoData?.[0]) {
        return undefined;
      }

      // console.log(generateId(reverseGeoData));

      return {
        id: await generateId(reverseGeoData),
        name: reverseGeoData[0].name,
        coord: {
          lat: input.coordinates.lat,
          lon: input.coordinates.lng,
        },
        country: reverseGeoData[0].country,
        region: reverseGeoData[0].state ?? "",
      };
    }),
});
