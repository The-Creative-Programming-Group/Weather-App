import { weatherRouter } from "~/server/api/routers/weather";
import { createTRPCRouter } from "~/server/api/trpc";
import { emailRouter } from "~/server/api/routers/email";
import { searchRouter } from "~/server/api/routers/search";
import { reverseGeoRouter } from "~/server/api/routers/reverseGeo";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  weather: weatherRouter,
  email: emailRouter,
  search: searchRouter,
  reverseGeoRouter: reverseGeoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
