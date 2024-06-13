import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { withAxiomRouteHandler } from "next-axiom";

import { appRouter, createTRPCContext } from "@weatherio/api";

import { env } from "~/env";

export const config = { runtime: "edge" };

// export API handler
const handler = withAxiomRouteHandler((req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });
});

export default handler;
