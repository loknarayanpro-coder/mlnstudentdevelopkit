import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../drizzle/schema";

const connectionString = process.env.DATABASE_URL;

// Initialized when direct PostgreSQL connection is configured
export const db = connectionString
  ? drizzle(postgres(connectionString, { prepare: false }), { schema })
  : null;

export { schema };
export * from "../../drizzle/schema";
