import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "../env";
import * as city from "./schema/city";

export const schema = { ...city };

export * from "drizzle-orm";

const client = createClient({
  url: env.TURSO_CONNECTION_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});
export const db = drizzle(client, { schema });
