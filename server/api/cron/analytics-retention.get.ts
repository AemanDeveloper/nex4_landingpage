import { timingSafeEqual } from "node:crypto";

function validSecret(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length
    && timingSafeEqual(actualBuffer, expectedBuffer);
}

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");

  const expected = useRuntimeConfig(event).cronSecret.trim();
  const authorization = getHeader(event, "authorization") ?? "";
  const supplied = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : "";

  if (!expected || !supplied || !validSecret(supplied, expected)) {
    throw createError({ statusCode: 401, statusMessage: "Invalid cron authorization" });
  }

  const result = await runManagementQuery(event, (sql) => sql<{ deleted: number }[]>`
    with deleted as (
      delete from management.traffic_events
      where occurred_at < now() - interval '90 days'
      returning 1
    )
    select count(*)::int as deleted from deleted
  `);

  return {
    retainedDays: 90,
    deleted: Number(result[0]?.deleted ?? 0),
    completedAt: new Date().toISOString(),
  };
});
