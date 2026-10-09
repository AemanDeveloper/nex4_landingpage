import { existsSync, readFileSync, readdirSync } from "node:fs";
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
  const migrationsDirectory = new URL("../database/migrations/", import.meta.url);
  const migrationFiles = readdirSync(migrationsDirectory)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const migrationFile of migrationFiles) {
    const migration = readFileSync(new URL(migrationFile, migrationsDirectory), "utf8");
    await sql.unsafe(migration);
    console.log(`Applied ${migrationFile}`);
  }

  const [result] = await sql`
    select
      to_regclass('management.users') is not null
      and to_regclass('management.analytics_sources') is not null
      and to_regclass('management.traffic_events') is not null
      and to_regclass('management.analytics_visitors') is not null as ready
  `;

  if (!result?.ready) throw new Error("Management database tables were not created.");
  console.log("Management database migration completed.");
} finally {
  await sql.end();
}
