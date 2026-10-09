type SystemId = "landing" | "lms-owner" | "crm" | "nutritrack";

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

type InteractionRow = {
  event_type: "section_view" | "button_click";
  target_id: string;
  views: number;
  unique_visitors: number;
};

type DimensionRow = {
  dimension: string;
  page_views: number;
  unique_visitors: number;
};

const systemIds = ["landing", "lms-owner", "crm", "nutritrack"] as const;
const systemNames: Record<SystemId, string> = {
  landing: "NEX4 Landing",
  "lms-owner": "NEX4 LMS",
  crm: "NEX4 CRM",
  nutritrack: "NEX4 NutriTrack",
};

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");

  const requestedRange = Number(getQuery(event).days);
  const rangeDays = [1, 7, 30].includes(requestedRange) ? requestedRange : 7;
  const rangeOffset = rangeDays - 1;

  const [rows, totalRows, interactionRows, deviceRows, sourceRows, lmsPageRows] = await runManagementQuery(
    event,
    (sql) => Promise.all([
    sql<AnalyticsRow[]>`
      with days as (
        select generate_series(
          (now() at time zone 'Asia/Kuala_Lumpur')::date - ${rangeOffset} * interval '1 day',
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
        max(traffic.occurred_at)::text as last_event_at
      from management.analytics_sources source
      cross join days
      left join management.traffic_events traffic
        on traffic.system_id = source.system_id
        and traffic.event_type = 'page_view'
        and (source.system_id <> 'lms-owner' or traffic.source = 'lms-user')
        and traffic.occurred_at >= (days.day::timestamp at time zone 'Asia/Kuala_Lumpur')
        and traffic.occurred_at < (
          (days.day + 1)::timestamp at time zone 'Asia/Kuala_Lumpur'
        )
      where source.is_active = true
      group by source.system_id, days.day
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
        and traffic.event_type = 'page_view'
        and (source.system_id <> 'lms-owner' or traffic.source = 'lms-user')
        and traffic.occurred_at >= (
          (
            (now() at time zone 'Asia/Kuala_Lumpur')::date - ${rangeOffset} * interval '1 day'
          )::timestamp at time zone 'Asia/Kuala_Lumpur'
        )
      where source.is_active = true
      group by source.system_id
    `,
    sql<InteractionRow[]>`
      select
        event_type,
        target_id,
        count(*)::int as views,
        count(distinct visitor_hash)::int as unique_visitors
      from management.traffic_events
      where system_id = 'landing'
        and event_type in ('section_view', 'button_click')
        and occurred_at >= (
          (
            (now() at time zone 'Asia/Kuala_Lumpur')::date - ${rangeOffset} * interval '1 day'
          )::timestamp at time zone 'Asia/Kuala_Lumpur'
        )
      group by event_type, target_id
      order by views desc, target_id
    `,
    sql<DimensionRow[]>`
      select
        device_type as dimension,
        count(*)::int as page_views,
        count(distinct visitor_hash)::int as unique_visitors
      from management.traffic_events
      where system_id = 'landing'
        and event_type = 'page_view'
        and occurred_at >= (
          (
            (now() at time zone 'Asia/Kuala_Lumpur')::date - ${rangeOffset} * interval '1 day'
          )::timestamp at time zone 'Asia/Kuala_Lumpur'
        )
      group by device_type
      order by page_views desc, device_type
    `,
    sql<DimensionRow[]>`
      select
        source as dimension,
        count(*)::int as page_views,
        count(distinct visitor_hash)::int as unique_visitors
      from management.traffic_events
      where system_id = 'landing'
        and event_type = 'page_view'
        and occurred_at >= (
          (
            (now() at time zone 'Asia/Kuala_Lumpur')::date - ${rangeOffset} * interval '1 day'
          )::timestamp at time zone 'Asia/Kuala_Lumpur'
        )
      group by source
      order by page_views desc, source
      limit 12
    `,
    sql<DimensionRow[]>`
      select
        path as dimension,
        count(*)::int as page_views,
        count(distinct visitor_hash)::int as unique_visitors
      from management.traffic_events
      where system_id = 'lms-owner'
        and event_type = 'page_view'
        and source = 'lms-user'
        and occurred_at >= (
          (
            (now() at time zone 'Asia/Kuala_Lumpur')::date - ${rangeOffset} * interval '1 day'
          )::timestamp at time zone 'Asia/Kuala_Lumpur'
        )
      group by path
      order by page_views desc, path
      limit 12
    `,
    ]),
  );

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

  const interactions = (eventType: InteractionRow["event_type"]) => interactionRows
    .filter((row) => row.event_type === eventType)
    .slice(0, 12)
    .map((row) => ({
      id: row.target_id,
      views: Number(row.views),
      uniqueVisitors: Number(row.unique_visitors),
    }));

  return {
    rangeDays,
    generatedAt: new Date().toISOString(),
    systems: systemIds.map((systemId) => {
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
    landing: {
      sections: interactions("section_view"),
      buttons: interactions("button_click"),
      devices: deviceRows.map((row) => ({
        id: row.dimension,
        pageViews: Number(row.page_views),
        uniqueVisitors: Number(row.unique_visitors),
      })),
      sources: sourceRows.map((row) => ({
        id: row.dimension,
        pageViews: Number(row.page_views),
        uniqueVisitors: Number(row.unique_visitors),
      })),
    },
    lms: {
      pages: lmsPageRows.map((row) => ({
        id: row.dimension,
        pageViews: Number(row.page_views),
        uniqueVisitors: Number(row.unique_visitors),
      })),
    },
  };
});
