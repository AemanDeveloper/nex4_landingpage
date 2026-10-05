import { existsSync } from "node:fs";
import process from "node:process";
import postgres from "postgres";

if (existsSync(".env")) process.loadEnvFile(".env");

const databaseUrl = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Set NUXT_DATABASE_URL before verifying analytics.");
  process.exit(1);
}

const sql = postgres(databaseUrl, {
  ssl: "require",
  max: 1,
  connect_timeout: 10,
  prepare: false,
});

try {
  const [result] = await sql`
    select
      to_regclass('management.analytics_sources') is not null as sources_table,
      to_regclass('management.traffic_events') is not null as events_table,
      to_regclass('management.traffic_events_system_occurred_idx') is not null
        as events_index,
      to_regclass('management.traffic_events_system_type_occurred_idx') is not null
        as event_type_index,
      to_regclass('management.traffic_events_system_target_occurred_idx') is not null
        as event_target_index,
      exists (
        select 1
        from information_schema.columns
        where table_schema = 'management'
          and table_name = 'traffic_events'
          and column_name = 'device_type'
      ) as device_dimension,
      exists (
        select 1
        from information_schema.columns
        where table_schema = 'management'
          and table_name = 'traffic_events'
          and column_name = 'source'
      ) as source_dimension,
      (
        select relrowsecurity and relforcerowsecurity
        from pg_class
        where oid = 'management.analytics_sources'::regclass
      ) as sources_rls,
      (
        select relrowsecurity and relforcerowsecurity
        from pg_class
        where oid = 'management.traffic_events'::regclass
      ) as events_rls,
      not has_table_privilege('anon', 'management.analytics_sources', 'select')
        as sources_private,
      not has_table_privilege('anon', 'management.traffic_events', 'select')
        as events_private,
      (select count(*) from management.analytics_sources) = 4 as four_sources
  `;

  const passed = Object.values(result).every(Boolean);
  console.log(JSON.stringify(result, null, 2));
  if (!passed) {
    console.error("Analytics database verification failed.");
    process.exitCode = 1;
  }
} finally {
  await sql.end();
}
