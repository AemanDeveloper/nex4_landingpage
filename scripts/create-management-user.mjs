import { randomBytes, scryptSync } from "node:crypto";
import { existsSync } from "node:fs";
import process from "node:process";
import postgres from "postgres";

if (existsSync(".env")) process.loadEnvFile(".env");

const databaseUrl = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL;
const username = (process.argv[2] || "admin").trim().toLowerCase();

if (!databaseUrl) {
  console.error("Set NUXT_DATABASE_URL before creating a management user.");
  process.exit(1);
}

if (!/^[a-z0-9._-]{3,100}$/.test(username)) {
  console.error("Username must be 3-100 characters using letters, numbers, dot, dash, or underscore.");
  process.exit(1);
}

const password = randomBytes(18).toString("base64url");
const salt = randomBytes(16).toString("hex");
const passwordHash = `$scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
const sql = postgres(databaseUrl, {
  ssl: "require",
  max: 1,
  connect_timeout: 10,
  prepare: false,
});

try {
  const created = await sql`
    insert into management.users (username, password_hash)
    values (${username}, ${passwordHash})
    on conflict do nothing
    returning username
  `;

  if (!created.length) {
    console.error(`Management user '${username}' already exists.`);
    process.exitCode = 1;
  } else {
    console.log(`Management user created: ${username}`);
    console.log("Generated password (shown once):");
    console.log(password);
  }
} finally {
  await sql.end();
}
