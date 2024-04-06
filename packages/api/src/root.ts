import { emailRouter } from "./routers/email";
import { searchRouter } from "./routers/search";
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
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
