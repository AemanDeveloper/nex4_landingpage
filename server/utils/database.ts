import postgres from "postgres";
import type { H3Event } from "h3";

let database: ReturnType<typeof postgres> | undefined;
let activeDatabaseUrl = "";

export function useManagementDatabase(event: H3Event) {
  const config = useRuntimeConfig(event);
  const databaseUrl = config.databaseUrl.trim();

  if (!databaseUrl) {
    throw createError({
      statusCode: 503,
      statusMessage: "Management database is not configured",
    });
  }

  if (!database || activeDatabaseUrl !== databaseUrl) {
    database = postgres(databaseUrl, {
      ssl: "require",
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
    activeDatabaseUrl = databaseUrl;
  }

  return database;
}

export type ManagementUser = {
  id: string;
  username: string;
  password_hash: string;
};

export async function findManagementUserByUsername(
  event: H3Event,
  username: string,
) {
  const sql = useManagementDatabase(event);
  const users = await sql<ManagementUser[]>`
    select id, username, password_hash
    from management.users
    where username = ${username}
      and is_active = true
    limit 1
  `;

  return users[0] ?? null;
}

export async function findActiveManagementUserById(
  event: H3Event,
  id: string,
) {
  const sql = useManagementDatabase(event);
  const users = await sql<Pick<ManagementUser, "id" | "username">[]>`
    select id, username
    from management.users
    where id = ${id}
      and is_active = true
    limit 1
  `;

  return users[0] ?? null;
}

export async function recordManagementLogin(event: H3Event, id: string) {
  const sql = useManagementDatabase(event);
  await sql`
    update management.users
    set last_login_at = now(), updated_at = now()
    where id = ${id}
  `;
}
