import { randomBytes } from "node:crypto";

console.log("Add this value to your local .env or hosting environment variables:\n");
console.log(`NUXT_MANAGEMENT_SESSION_SECRET=${randomBytes(48).toString("base64url")}`);
