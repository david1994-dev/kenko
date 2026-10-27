import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pg?: ReturnType<typeof postgres> };

function client() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  // Mỗi instance serverless chỉ giữ một kết nối; dùng URL pooled của Neon.
  return postgres(url, { max: 1, prepare: false });
}

const pg = (globalForDb.pg ??= client());

export const db = drizzle(pg, { schema });
export { schema };
