import { existsSync, readFileSync } from "node:fs";
import process from "node:process";
import postgres from "postgres";

if (existsSync(".env")) process.loadEnvFile(".env");

const databaseUrl = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Set NUXT_DATABASE_URL before running migrations.");
  process.exit(1);
}

const sql = postgres(databaseUrl, {
  ssl: "require",
  max: 1,
  connect_timeout: 10,
  prepare: false,
});

try {
  const migration = readFileSync(
    new URL("../database/migrations/001_create_management_users.sql", import.meta.url),
    "utf8",
  );
  await sql.unsafe(migration);
  const [result] = await sql`
    select to_regclass('management.users') is not null as ready
  `;

  if (!result?.ready) throw new Error("Management users table was not created.");
  console.log("Management database migration completed.");
} finally {
  await sql.end();
}
