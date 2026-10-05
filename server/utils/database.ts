import postgres from "postgres";
import type { H3Event } from "h3";

let database: ReturnType<typeof postgres> | undefined;
let activeDatabaseUrl = "";
const defaultQueryTimeoutMs = 8_000;

class ManagementDatabaseTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Management database request timed out after ${timeoutMs}ms`);
    this.name = "ManagementDatabaseTimeoutError";
  }
}

function discardManagementDatabase(sql: ReturnType<typeof postgres>) {
  if (database === sql) {
    database = undefined;
    activeDatabaseUrl = "";
  }

  void sql.end({ timeout: 0 }).catch(() => undefined);
}

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
      idle_timeout: 10,
      connect_timeout: 5,
      max_lifetime: 60,
      prepare: false,
    });
    activeDatabaseUrl = databaseUrl;
  }

  return database;
}

export async function runManagementQuery<T>(
  event: H3Event,
  query: (sql: ReturnType<typeof postgres>) => PromiseLike<T>,
  timeoutMs = defaultQueryTimeoutMs,
) {
  const sql = useManagementDatabase(event);
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      query(sql),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new ManagementDatabaseTimeoutError(timeoutMs)),
          timeoutMs,
        );
      }),
    ]);
  } catch (error) {
    discardManagementDatabase(sql);
    throw error;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
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
  const users = await runManagementQuery(event, (sql) => sql<ManagementUser[]>`
      select id, username, password_hash
      from management.users
      where username = ${username}
        and is_active = true
      limit 1
    `);

  return users[0] ?? null;
}

export async function findActiveManagementUserById(
  event: H3Event,
  id: string,
) {
  const users = await runManagementQuery(
    event,
    (sql) => sql<Pick<ManagementUser, "id" | "username">[]>`
      select id, username
      from management.users
      where id = ${id}
        and is_active = true
      limit 1
    `,
  );

  return users[0] ?? null;
}

export async function recordManagementLogin(event: H3Event, id: string) {
  await runManagementQuery(
    event,
    (sql) => sql`
      update management.users
      set last_login_at = now(), updated_at = now()
      where id = ${id}
    `,
    3_000,
  );
}
