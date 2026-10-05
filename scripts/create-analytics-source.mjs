import { createHash, randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import process from "node:process";
import postgres from "postgres";

if (existsSync(".env")) process.loadEnvFile(".env");

const databaseUrl = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL;
const systemId = (process.argv[2] || "").trim().toLowerCase();
const allowedSystems = new Set(["landing", "lms-owner", "crm", "nutritrack"]);

if (!databaseUrl) {
  console.error("Set NUXT_DATABASE_URL before creating an analytics source token.");
  process.exit(1);
}
if (!allowedSystems.has(systemId)) {
  console.error("System must be one of: landing, lms-owner, crm, nutritrack.");
  process.exit(1);
}

const token = `nex4_analytics_${systemId}_${randomBytes(24).toString("base64url")}`;
const secretHash = createHash("sha256").update(token).digest("hex");
const sql = postgres(databaseUrl, {
  ssl: "require",
  max: 1,
  connect_timeout: 10,
  prepare: false,
});

try {
  await sql`
    update management.analytics_sources
    set secret_hash = ${secretHash}, updated_at = now()
    where system_id = ${systemId}
  `;
  console.log(`Analytics token created for: ${systemId}`);
  console.log("Token (shown once):");
  console.log(token);
} finally {
  await sql.end();
}
