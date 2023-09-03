import { z } from "zod";
import {
  createTRPCRouter,
  rateLimitedProcedure,
} from "~/server/api/trpc";
import { env } from "~/env.mjs";
import axios from "axios";
import { log } from "next-axiom";

const reverseGeoSchema = z.object({
  name: z.string(),
  country: z.string(),
  state: z.string(),
});

type ReverseGeo = z.infer<typeof reverseGeoSchema> | undefined;

export const reverseGeoRouter = createTRPCRouter({
  getCity: rateLimitedProcedure
    .input(
      z.object({
        coordinates: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
      })
    )
    .query(async ({ input }) => {
      log.info("User requested location data for coordiantes", {
        coordinates: input.coordinates,
      })

      const urlReverseGeo = `https://api.api-ninjas.com/v1/reversegeocoding?lat=${input.coordinates.lat.toString()}&lon=${input.coordinates.lng.toString}`

      let reverseGeoResult =
        axios.get<ReverseGeo>(urlReverseGeo, {
          headers: {
            'X-Api-Key': `${env.API_NINJAS_API_KEY}`,
          }
        })
      
      let reverseGeoData: ReverseGeo = undefined;

      reverseGeoData = reverseGeoSchema.parse((await reverseGeoResult).data);
      return {
        city: reverseGeoData?.name,
      };
    })
})