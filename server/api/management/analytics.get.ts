type SystemId = "lms-owner" | "crm" | "nutritrack";

type AnalyticsRow = {
  system_id: SystemId;
  day: string;
  page_views: number;
  unique_visitors: number;
  sessions: number;
  last_event_at: string | null;
};

type AnalyticsTotalRow = {
  system_id: SystemId;
  page_views: number;
  unique_visitors: number;
  sessions: number;
};

const systemNames: Record<SystemId, string> = {
  "lms-owner": "LMS Owner",
  crm: "NEX4 CRM",
  nutritrack: "NEX4 NutriTrack",
};

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");

  const sql = useManagementDatabase(event);
  const [rows, totalRows] = await Promise.all([
    sql<AnalyticsRow[]>`
    with days as (
      select generate_series(
        (now() at time zone 'Asia/Kuala_Lumpur')::date - interval '6 days',
        (now() at time zone 'Asia/Kuala_Lumpur')::date,
        interval '1 day'
      )::date as day
    )
    select
      source.system_id,
      days.day::text as day,
      count(traffic.id)::int as page_views,
      count(distinct traffic.visitor_hash)::int as unique_visitors,
      count(distinct traffic.session_hash)::int as sessions,
      source.last_event_at
    from management.analytics_sources source
    cross join days
    left join management.traffic_events traffic
      on traffic.system_id = source.system_id
      and traffic.occurred_at >= (days.day::timestamp at time zone 'Asia/Kuala_Lumpur')
      and traffic.occurred_at < (
        (days.day + 1)::timestamp at time zone 'Asia/Kuala_Lumpur'
      )
    where source.is_active = true
    group by source.system_id, source.last_event_at, days.day
    order by source.system_id, days.day
    `,
    sql<AnalyticsTotalRow[]>`
      select
        source.system_id,
        count(traffic.id)::int as page_views,
        count(distinct traffic.visitor_hash)::int as unique_visitors,
        count(distinct traffic.session_hash)::int as sessions
      from management.analytics_sources source
      left join management.traffic_events traffic
        on traffic.system_id = source.system_id
        and traffic.occurred_at >= (
          (
            (now() at time zone 'Asia/Kuala_Lumpur')::date - interval '6 days'
          )::timestamp at time zone 'Asia/Kuala_Lumpur'
        )
      where source.is_active = true
      group by source.system_id
    `,
  ]);

  const totalsBySystem = new Map(
    totalRows.map((row) => [row.system_id, {
      pageViews: Number(row.page_views),
      uniqueVisitors: Number(row.unique_visitors),
      sessions: Number(row.sessions),
    }]),
  );

  const grouped = new Map<SystemId, AnalyticsRow[]>();
  for (const row of rows) {
    const existing = grouped.get(row.system_id) ?? [];
    existing.push(row);
    grouped.set(row.system_id, existing);
  }

  return {
    rangeDays: 7,
    generatedAt: new Date().toISOString(),
    systems: (["lms-owner", "crm", "nutritrack"] as const).map((systemId) => {
      const dailyRows = grouped.get(systemId) ?? [];

      return {
        id: systemId,
        name: systemNames[systemId],
        connected: dailyRows.some((row) => row.last_event_at !== null),
        lastEventAt: dailyRows[0]?.last_event_at ?? null,
        totals: totalsBySystem.get(systemId) ?? {
          pageViews: 0,
          uniqueVisitors: 0,
          sessions: 0,
        },
        daily: dailyRows.map((row) => ({
          date: row.day,
          pageViews: Number(row.page_views),
          uniqueVisitors: Number(row.unique_visitors),
          sessions: Number(row.sessions),
        })),
      };
    }),
  };
});
