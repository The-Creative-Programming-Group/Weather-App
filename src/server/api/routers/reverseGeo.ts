import { z } from "zod";
import { createTRPCRouter, rateLimitedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import axios from "axios";
import { log } from "next-axiom";

const reverseGeoSchema = z.array(
  z.object({
    name: z.string(),
    country: z.string(),
    state: z.string(),
  }),
);

type ReverseGeo = z.infer<typeof reverseGeoSchema> | undefined;

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
    .query(async ({ input }) => {
      log.info("User requested location data for coordinates", {
        coordinates: input.coordinates,
      });

      const urlReverseGeo = `https://api.api-ninjas.com/v1/reversegeocoding?lat=${input.coordinates.lat.toString()}&lon=${input.coordinates.lng.toString()}`;

      let reverseGeoData: ReverseGeo = undefined;

      try {
        let reverseGeoResult = await axios.get<ReverseGeo>(urlReverseGeo, {
          headers: {
            "X-Api-Key": `${env.API_NINJAS_API_KEY}`,
          },
        });
        /* log.debug("Reverse geocoding data", {
            data: (reverseGeoResult).data,
        }); */
        reverseGeoData = reverseGeoSchema.parse(reverseGeoResult.data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          log.error("Zod Errors", error.issues);
        } else {
          log.error("Error while fetching reverse geocoding data", {
            error: error,
          });
        }
      }

      return {
        city:
          reverseGeoData && reverseGeoData[0]
            ? reverseGeoData[0].name
            : "Unknown",
      };
    }),
});
