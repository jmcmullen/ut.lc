import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "./env";
import * as schema from "./schema";

const sql = neon(env.DATABASE_URL);

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
export const db = drizzle(sql as any, { schema });

export type DB = typeof db;
