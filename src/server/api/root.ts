import { weatherRouter } from "~/server/api/routers/weather";
import { reverseGeoRouter } from "~/server/api/routers/reverseGeo";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  weather: weatherRouter,
  reverseGeoRouter: reverseGeoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
