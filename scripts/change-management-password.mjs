import { randomBytes, scryptSync } from "node:crypto";
import { existsSync } from "node:fs";
import process from "node:process";
import postgres from "postgres";

if (existsSync(".env")) process.loadEnvFile(".env");

const databaseUrl = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL;
const username = (process.argv[2] || "admin").trim().toLowerCase();
const password = process.env.MANAGEMENT_NEW_PASSWORD || "";

if (!databaseUrl) {
  console.error("Set NUXT_DATABASE_URL before changing a management password.");
  process.exit(1);
}
if (!/^[a-z0-9._-]{3,100}$/.test(username)) {
  console.error("Username must be 3-100 characters using letters, numbers, dot, dash, or underscore.");
  process.exit(1);
}
if (password.length < 12 || password.length > 200) {
  console.error("MANAGEMENT_NEW_PASSWORD must be between 12 and 200 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const passwordHash = `$scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
const sql = postgres(databaseUrl, {
  ssl: "require",
  max: 1,
  connect_timeout: 10,
  prepare: false,
});

try {
  const updated = await sql`
    update management.users
    set password_hash = ${passwordHash}, updated_at = now()
    where username = ${username}
      and is_active = true
    returning username
  `;

  if (!updated.length) {
    console.error(`Active management user '${username}' was not found.`);
    process.exitCode = 1;
  } else {
    console.log(`Management password updated for: ${username}`);
  }
} finally {
  await sql.end();
}
