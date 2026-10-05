import { createHash, createHmac } from "node:crypto";

type TrafficPayload = {
  eventType?: unknown;
  path?: unknown;
  targetId?: unknown;
  deviceType?: unknown;
  source?: unknown;
  visitorId?: unknown;
  sessionId?: unknown;
};

type AnalyticsSource = {
  system_id: "landing" | "lms-owner" | "crm" | "nutritrack";
};

const eventWindows = new Map<string, { count: number; resetsAt: number }>();
const maxEventsPerMinute = 300;
const eventTypes = new Set(["page_view", "section_view", "button_click"]);
const deviceTypes = new Set(["desktop", "tablet", "mobile", "unknown"]);
const labelPattern = /^[a-z0-9][a-z0-9._:/-]{0,119}$/;

function validText(value: unknown, maxLength: number) {
  return typeof value === "string" && value.length > 0 && value.length <= maxLength;
}

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");

  const authorization = getHeader(event, "authorization") ?? "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : "";

  if (token.length < 32 || token.length > 256) {
    throw createError({ statusCode: 401, statusMessage: "Invalid telemetry token" });
  }

  const contentLength = Number(getHeader(event, "content-length") ?? 0);
  if (contentLength > 4_096) {
    throw createError({ statusCode: 413, statusMessage: "Telemetry payload too large" });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const sql = useManagementDatabase(event);
  const sources = await sql<AnalyticsSource[]>`
    select system_id
    from management.analytics_sources
    where secret_hash = ${tokenHash}
      and is_active = true
    limit 1
  `;
  const source = sources[0];

  if (!source) {
    throw createError({ statusCode: 401, statusMessage: "Invalid telemetry token" });
  }


  const now = Date.now();
  const currentWindow = eventWindows.get(tokenHash);
  if (!currentWindow || currentWindow.resetsAt <= now) {
    eventWindows.set(tokenHash, { count: 1, resetsAt: now + 60_000 });
  } else if (currentWindow.count >= maxEventsPerMinute) {
    throw createError({ statusCode: 429, statusMessage: "Telemetry rate limit exceeded" });
  } else {
    currentWindow.count += 1;
  }

  const body = await readBody<TrafficPayload>(event);
  const eventType = typeof body.eventType === "string" ? body.eventType : "page_view";
  const targetId = typeof body.targetId === "string" ? body.targetId : null;
  const deviceType = typeof body.deviceType === "string" ? body.deviceType : "unknown";
  const trafficSource = typeof body.source === "string" ? body.source : "unknown";
  if (
    !eventTypes.has(eventType)
    || !validText(body.path, 500)
    || !(body.path as string).startsWith("/")
    || (body.path as string).startsWith("//")
    || (body.path as string).includes("?")
    || (body.path as string).includes("#")
    || !deviceTypes.has(deviceType)
    || !labelPattern.test(trafficSource)
    || (eventType === "page_view" && targetId !== null)
    || (eventType !== "page_view" && (!targetId || !labelPattern.test(targetId)))
  ) {
    throw createError({ statusCode: 400, statusMessage: "Invalid telemetry event" });
  }
  if (!validText(body.visitorId, 200)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid visitor ID" });
  }
  if (body.sessionId !== undefined && !validText(body.sessionId, 200)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid session ID" });
  }

  const visitorHash = createHmac("sha256", token)
    .update(body.visitorId as string)
    .digest("hex");
  const sessionHash = body.sessionId
    ? createHmac("sha256", token).update(body.sessionId as string).digest("hex")
    : null;

  await sql`
    with inserted as (
      insert into management.traffic_events (
        system_id,
        event_type,
        path,
        target_id,
        device_type,
        source,
        visitor_hash,
        session_hash
      ) values (
        ${source.system_id},
        ${eventType},
        ${body.path as string},
        ${targetId},
        ${deviceType},
        ${trafficSource},
        ${visitorHash},
        ${sessionHash}
      )
      returning system_id, occurred_at
    )
    update management.analytics_sources source
    set
      connected_at = coalesce(source.connected_at, inserted.occurred_at),
      last_event_at = inserted.occurred_at,
      updated_at = now()
    from inserted
    where source.system_id = inserted.system_id
  `;

  setResponseStatus(event, 202);
  return { accepted: true };
});
