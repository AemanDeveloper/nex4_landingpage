import { createHash } from "node:crypto";

type LandingEvent = {
  eventType?: unknown;
  path?: unknown;
  targetId?: unknown;
  deviceType?: unknown;
  source?: unknown;
  visitorId?: unknown;
  sessionId?: unknown;
};

const eventTypes = new Set(["page_view", "section_view", "button_click"]);
const deviceTypes = new Set(["desktop", "tablet", "mobile"]);
const anonymousIdPattern = /^[A-Za-z0-9_-]{16,128}$/;
const labelPattern = /^[a-z0-9][a-z0-9._:/-]{0,119}$/;
const eventWindows = new Map<string, { count: number; resetsAt: number }>();

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");

  const contentLength = Number(getHeader(event, "content-length") ?? 0);
  if (contentLength > 2_048) {
    throw createError({ statusCode: 413, statusMessage: "Telemetry payload too large" });
  }

  const fetchSite = getHeader(event, "sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") {
    throw createError({ statusCode: 403, statusMessage: "Cross-site telemetry rejected" });
  }

  const body = await readBody<LandingEvent>(event);
  const eventType = typeof body.eventType === "string" ? body.eventType : "";
  const targetId = typeof body.targetId === "string" ? body.targetId : undefined;
  const deviceType = typeof body.deviceType === "string" ? body.deviceType : "";
  const source = typeof body.source === "string" ? body.source : "";

  if (
    !eventTypes.has(eventType)
    || typeof body.path !== "string"
    || body.path !== "/"
    || !deviceTypes.has(deviceType)
    || !labelPattern.test(source)
    || typeof body.visitorId !== "string"
    || !anonymousIdPattern.test(body.visitorId)
    || typeof body.sessionId !== "string"
    || !anonymousIdPattern.test(body.sessionId)
    || (eventType === "page_view" && targetId !== undefined)
    || (eventType !== "page_view" && (!targetId || !labelPattern.test(targetId)))
  ) {
    throw createError({ statusCode: 400, statusMessage: "Invalid telemetry event" });
  }

  const rateKey = createHash("sha256").update(body.visitorId).digest("hex");
  const now = Date.now();
  if (eventWindows.size > 10_000) {
    for (const [key, value] of eventWindows) {
      if (value.resetsAt <= now) eventWindows.delete(key);
    }
  }
  const currentWindow = eventWindows.get(rateKey);
  if (!currentWindow || currentWindow.resetsAt <= now) {
    eventWindows.set(rateKey, { count: 1, resetsAt: now + 60_000 });
  } else if (currentWindow.count >= 60) {
    throw createError({ statusCode: 429, statusMessage: "Telemetry rate limit exceeded" });
  } else {
    currentWindow.count += 1;
  }

  const config = useRuntimeConfig(event);
  const token = config.landingAnalyticsToken;
  if (typeof token !== "string" || !token) {
    setResponseStatus(event, 204);
    return null;
  }

  try {
    await $fetch("https://www.nex4.my/api/telemetry/traffic", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: {
        eventType,
        path: body.path,
        targetId,
        deviceType,
        source,
        visitorId: body.visitorId,
        sessionId: body.sessionId,
      },
      timeout: 3_000,
    });
  } catch {
    // Analytics is best-effort and must never interrupt the landing page.
  }

  setResponseStatus(event, 204);
  return null;
});
