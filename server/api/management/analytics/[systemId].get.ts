type SystemId = "landing" | "lms-owner" | "crm" | "nutritrack";

type SummaryRow = {
  page_views: number;
  unique_visitors: number;
  sessions: number;
  new_visitors: number;
  returning_visitors: number;
  pages_per_session: number;
  average_session_seconds: number;
  last_event_at: string | null;
};

type DailyRow = {
  day: string;
  page_views: number;
  unique_visitors: number;
  sessions: number;
  actions: number;
};

type PageRow = {
  path: string;
  page_views: number;
  unique_visitors: number;
  entrances: number;
  exits: number;
};

type ActionRow = {
  target_id: string;
  path: string;
  destination: string | null;
  clicks: number;
  unique_visitors: number;
};

type DimensionRow = {
  dimension: string;
  events: number;
  unique_visitors: number;
};

type EventRow = {
  occurred_at: string;
  event_type: "page_view" | "section_view" | "button_click";
  path: string;
  target_id: string | null;
  destination: string | null;
  device_type: string;
  source: string;
  visitor_alias: string;
  session_alias: string | null;
};

type JourneyRow = EventRow & {
  session_last_event_at: string;
};

const systemIds = new Set<SystemId>(["landing", "lms-owner", "crm", "nutritrack"]);
const systemNames: Record<SystemId, string> = {
  landing: "NEX4 Landing",
  "lms-owner": "NEX4 LMS",
  crm: "NEX4 CRM",
  nutritrack: "NEX4 NutriTrack",
};

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");

  const rawSystemId = getRouterParam(event, "systemId") ?? "";
  if (!systemIds.has(rawSystemId as SystemId)) {
    throw createError({ statusCode: 404, statusMessage: "Analytics project not found" });
  }

  const systemId = rawSystemId as SystemId;
  const requestedRange = Number(getQuery(event).days);
  const rangeDays = [1, 7, 30].includes(requestedRange) ? requestedRange : 7;
  const rangeOffset = rangeDays - 1;

  const [summaryRows, dailyRows, pageRows, actionRows, deviceRows, sourceRows, recentRows, journeyRows] =
    await runManagementQuery(event, (sql) => Promise.all([
      sql<SummaryRow[]>`
        with range_start as (
          select (
            (
              (now() at time zone 'Asia/Kuala_Lumpur')::date
              - ${rangeOffset} * interval '1 day'
            )::timestamp at time zone 'Asia/Kuala_Lumpur'
          ) as starts_at
        ),
        range_events as (
          select traffic.*
          from management.traffic_events traffic
          cross join range_start
          where traffic.system_id = ${systemId}
            and (${systemId} <> 'lms-owner' or traffic.source = 'lms-user')
            and traffic.occurred_at >= range_start.starts_at
        ),
        range_visitors as (
          select distinct visitor_hash from range_events where event_type = 'page_view'
        ),
        session_stats as (
          select
            session_hash,
            count(*) filter (where event_type = 'page_view')::float as page_views,
            extract(epoch from max(occurred_at) - min(occurred_at))::float as duration_seconds
          from range_events
          where session_hash is not null
          group by session_hash
        )
        select
          (select count(*) from range_events where event_type = 'page_view')::int as page_views,
          (select count(*) from range_visitors)::int as unique_visitors,
          (select count(distinct session_hash) from range_events)::int as sessions,
          (
            select count(*)
            from range_visitors visitor
            join management.analytics_visitors profile
              on profile.system_id = ${systemId}
              and profile.visitor_hash = visitor.visitor_hash
            cross join range_start
            where profile.first_seen_at >= range_start.starts_at
          )::int as new_visitors,
          (
            select count(*)
            from range_visitors visitor
            join management.analytics_visitors profile
              on profile.system_id = ${systemId}
              and profile.visitor_hash = visitor.visitor_hash
            cross join range_start
            where profile.first_seen_at < range_start.starts_at
          )::int as returning_visitors,
          coalesce((select avg(page_views) from session_stats), 0)::float as pages_per_session,
          coalesce((select avg(duration_seconds) from session_stats), 0)::float as average_session_seconds,
          (select max(occurred_at)::text from range_events) as last_event_at
      `,
      sql<DailyRow[]>`
        with days as (
          select generate_series(
            (now() at time zone 'Asia/Kuala_Lumpur')::date - ${rangeOffset} * interval '1 day',
            (now() at time zone 'Asia/Kuala_Lumpur')::date,
            interval '1 day'
          )::date as day
        )
        select
          days.day::text as day,
          count(traffic.id) filter (where traffic.event_type = 'page_view')::int as page_views,
          count(distinct traffic.visitor_hash) filter (where traffic.event_type = 'page_view')::int as unique_visitors,
          count(distinct traffic.session_hash)::int as sessions,
          count(traffic.id) filter (where traffic.event_type <> 'page_view')::int as actions
        from days
        left join management.traffic_events traffic
          on traffic.system_id = ${systemId}
          and (${systemId} <> 'lms-owner' or traffic.source = 'lms-user')
          and traffic.occurred_at >= (days.day::timestamp at time zone 'Asia/Kuala_Lumpur')
          and traffic.occurred_at < ((days.day + 1)::timestamp at time zone 'Asia/Kuala_Lumpur')
        group by days.day
        order by days.day
      `,
      sql<PageRow[]>`
        with page_events as (
          select
            path,
            visitor_hash,
            session_hash,
            occurred_at,
            row_number() over (partition by session_hash order by occurred_at) as first_rank,
            row_number() over (partition by session_hash order by occurred_at desc) as last_rank
          from management.traffic_events
          where system_id = ${systemId}
            and (${systemId} <> 'lms-owner' or source = 'lms-user')
            and event_type = 'page_view'
            and occurred_at >= (
              (
                (now() at time zone 'Asia/Kuala_Lumpur')::date
                - ${rangeOffset} * interval '1 day'
              )::timestamp at time zone 'Asia/Kuala_Lumpur'
            )
        )
        select
          path,
          count(*)::int as page_views,
          count(distinct visitor_hash)::int as unique_visitors,
          count(*) filter (where first_rank = 1)::int as entrances,
          count(*) filter (where last_rank = 1)::int as exits
        from page_events
        group by path
        order by page_views desc, path
        limit 20
      `,
      sql<ActionRow[]>`
        select
          target_id,
          path,
          destination,
          count(*)::int as clicks,
          count(distinct visitor_hash)::int as unique_visitors
        from management.traffic_events
        where system_id = ${systemId}
          and (${systemId} <> 'lms-owner' or source = 'lms-user')
          and event_type in ('button_click', 'section_view')
          and occurred_at >= (
            (
              (now() at time zone 'Asia/Kuala_Lumpur')::date
              - ${rangeOffset} * interval '1 day'
            )::timestamp at time zone 'Asia/Kuala_Lumpur'
          )
        group by target_id, path, destination
        order by clicks desc, target_id
        limit 20
      `,
      sql<DimensionRow[]>`
        select
          device_type as dimension,
          count(*)::int as events,
          count(distinct visitor_hash)::int as unique_visitors
        from management.traffic_events
        where system_id = ${systemId}
          and (${systemId} <> 'lms-owner' or source = 'lms-user')
          and event_type = 'page_view'
          and occurred_at >= (
            (
              (now() at time zone 'Asia/Kuala_Lumpur')::date
              - ${rangeOffset} * interval '1 day'
            )::timestamp at time zone 'Asia/Kuala_Lumpur'
          )
        group by device_type
        order by events desc
      `,
      sql<DimensionRow[]>`
        select
          source as dimension,
          count(*)::int as events,
          count(distinct visitor_hash)::int as unique_visitors
        from management.traffic_events
        where system_id = ${systemId}
          and (${systemId} <> 'lms-owner' or source = 'lms-user')
          and event_type = 'page_view'
          and occurred_at >= (
            (
              (now() at time zone 'Asia/Kuala_Lumpur')::date
              - ${rangeOffset} * interval '1 day'
            )::timestamp at time zone 'Asia/Kuala_Lumpur'
          )
        group by source
        order by events desc
        limit 20
      `,
      sql<EventRow[]>`
        select
          occurred_at::text,
          event_type,
          path,
          target_id,
          destination,
          device_type,
          source,
          'visitor-' || substring(visitor_hash from 1 for 8) as visitor_alias,
          case
            when session_hash is null then null
            else 'session-' || substring(session_hash from 1 for 8)
          end as session_alias
        from management.traffic_events
        where system_id = ${systemId}
          and (${systemId} <> 'lms-owner' or source = 'lms-user')
          and occurred_at >= (
            (
              (now() at time zone 'Asia/Kuala_Lumpur')::date
              - ${rangeOffset} * interval '1 day'
            )::timestamp at time zone 'Asia/Kuala_Lumpur'
          )
        order by occurred_at desc
        limit 100
      `,
      sql<JourneyRow[]>`
        with recent_sessions as (
          select session_hash, max(occurred_at) as last_event_at
          from management.traffic_events
          where system_id = ${systemId}
            and (${systemId} <> 'lms-owner' or source = 'lms-user')
            and session_hash is not null
            and occurred_at >= (
              (
                (now() at time zone 'Asia/Kuala_Lumpur')::date
                - ${rangeOffset} * interval '1 day'
              )::timestamp at time zone 'Asia/Kuala_Lumpur'
            )
          group by session_hash
          order by last_event_at desc
          limit 20
        )
        select
          traffic.occurred_at::text,
          traffic.event_type,
          traffic.path,
          traffic.target_id,
          traffic.destination,
          traffic.device_type,
          traffic.source,
          'visitor-' || substring(traffic.visitor_hash from 1 for 8) as visitor_alias,
          'session-' || substring(traffic.session_hash from 1 for 8) as session_alias,
          recent_sessions.last_event_at::text as session_last_event_at
        from recent_sessions
        join management.traffic_events traffic
          on traffic.system_id = ${systemId}
          and traffic.session_hash = recent_sessions.session_hash
          and (${systemId} <> 'lms-owner' or traffic.source = 'lms-user')
        order by recent_sessions.last_event_at desc, traffic.occurred_at
        limit 300
      `,
    ]));

  const summary = summaryRows[0] ?? {
    page_views: 0,
    unique_visitors: 0,
    sessions: 0,
    new_visitors: 0,
    returning_visitors: 0,
    pages_per_session: 0,
    average_session_seconds: 0,
    last_event_at: null,
  };
  const visitorTotal = Number(summary.new_visitors) + Number(summary.returning_visitors);
  const journeys = new Map<string, {
    id: string;
    visitor: string;
    device: string;
    source: string;
    lastEventAt: string;
    events: Array<{
      occurredAt: string;
      type: EventRow["event_type"];
      path: string;
      target: string | null;
      destination: string | null;
    }>;
  }>();

  for (const row of journeyRows) {
    if (!row.session_alias) continue;
    const journey = journeys.get(row.session_alias) ?? {
      id: row.session_alias,
      visitor: row.visitor_alias,
      device: row.device_type,
      source: row.source,
      lastEventAt: row.session_last_event_at,
      events: [],
    };
    journey.events.push({
      occurredAt: row.occurred_at,
      type: row.event_type,
      path: row.path,
      target: row.target_id,
      destination: row.destination,
    });
    journeys.set(row.session_alias, journey);
  }

  return {
    system: { id: systemId, name: systemNames[systemId] },
    rangeDays,
    generatedAt: new Date().toISOString(),
    summary: {
      pageViews: Number(summary.page_views),
      uniqueVisitors: Number(summary.unique_visitors),
      sessions: Number(summary.sessions),
      newVisitors: Number(summary.new_visitors),
      returningVisitors: Number(summary.returning_visitors),
      returningRate: visitorTotal > 0
        ? Math.round((Number(summary.returning_visitors) / visitorTotal) * 1000) / 10
        : 0,
      pagesPerSession: Number(summary.pages_per_session),
      averageSessionSeconds: Number(summary.average_session_seconds),
      lastEventAt: summary.last_event_at,
    },
    daily: dailyRows.map((row) => ({
      date: row.day,
      pageViews: Number(row.page_views),
      uniqueVisitors: Number(row.unique_visitors),
      sessions: Number(row.sessions),
      actions: Number(row.actions),
    })),
    pages: pageRows.map((row) => ({
      path: row.path,
      pageViews: Number(row.page_views),
      uniqueVisitors: Number(row.unique_visitors),
      entrances: Number(row.entrances),
      exits: Number(row.exits),
    })),
    actions: actionRows.map((row) => ({
      target: row.target_id,
      path: row.path,
      destination: row.destination,
      clicks: Number(row.clicks),
      uniqueVisitors: Number(row.unique_visitors),
    })),
    devices: deviceRows.map((row) => ({
      id: row.dimension,
      events: Number(row.events),
      uniqueVisitors: Number(row.unique_visitors),
    })),
    sources: sourceRows.map((row) => ({
      id: row.dimension,
      events: Number(row.events),
      uniqueVisitors: Number(row.unique_visitors),
    })),
    recentEvents: recentRows.map((row) => ({
      occurredAt: row.occurred_at,
      type: row.event_type,
      path: row.path,
      target: row.target_id,
      destination: row.destination,
      device: row.device_type,
      source: row.source,
      visitor: row.visitor_alias,
      session: row.session_alias,
    })),
    journeys: Array.from(journeys.values()),
  };
});
