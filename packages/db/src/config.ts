import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  tablesFilter: ["weatherio_*"],
} satisfies Config;
