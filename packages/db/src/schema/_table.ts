import { sqliteTableCreator } from "drizzle-orm/sqlite-core";

/**
 * Use the same database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const sqliteTable = sqliteTableCreator((name) => `weatherio_${name}`);
