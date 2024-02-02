import { emailRouter } from "./routers/email";
import { reverseGeoRouter } from "./routers/reverseGeo";
import { weatherRouter } from "./routers/weather";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  weather: weatherRouter,
  email: emailRouter,
  reverseGeoRouter: reverseGeoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
