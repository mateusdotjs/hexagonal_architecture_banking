import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export function createDrizzle(connectionString: string) {
  const pool = new Pool({
    connectionString,
  });

  return drizzle({ client: pool });
}

export type DrizzleDB = ReturnType<typeof createDrizzle>;

