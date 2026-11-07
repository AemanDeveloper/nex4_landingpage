import { createHash, timingSafeEqual } from "node:crypto";

/**
 * TEMPORARY one-time setup route: applies migration 005 and stores the hash of the
 * Lensa analytics token. Protected by NUXT_LENSA_SETUP_SECRET. Remove after use.
 */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");
  const expected = process.env.NUXT_LENSA_SETUP_SECRET ?? "";
  const provided = (getHeader(event, "x-setup-secret") ?? "").trim();
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (expected.length < 40 || !timingSafeEqual(digest(expected), digest(provided))) {
    throw createError({ statusCode: 404, statusMessage: "Not found" });
  }

  const body = await readBody<{ secretHash?: unknown }>(event);
  const secretHash = typeof body.secretHash === "string" ? body.secretHash : "";
  if (!/^[a-f0-9]{64}$/.test(secretHash)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid token hash" });
  }

  const rows = await runManagementQuery(event, (sql) => sql.begin(async (tx) => {
    await tx.unsafe("alter table management.analytics_sources drop constraint if exists analytics_sources_system_id_allowed");
    await tx.unsafe("alter table management.analytics_sources add constraint analytics_sources_system_id_allowed check (system_id in ('landing', 'lms-owner', 'crm', 'nutritrack', 'lensa'))");
    await tx`insert into management.analytics_sources (system_id) values ('lensa') on conflict (system_id) do nothing`;
    return tx`
      update management.analytics_sources
      set secret_hash = ${secretHash}, is_active = true, updated_at = now()
      where system_id = 'lensa'
      returning system_id, is_active, connected_at
    `;
  }));

  return { ok: true, source: rows[0] ?? null };
});
