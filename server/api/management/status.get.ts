type ManagedSystem = {
  id: "lms-owner" | "crm";
  name: string;
  description: string;
  url: string;
  actionLabel: string;
};

type SystemStatus = ManagedSystem & {
  online: boolean;
  httpStatus: number | null;
  responseTimeMs: number | null;
  lastChecked: string;
};

const systems: ManagedSystem[] = [
  {
    id: "lms-owner",
    name: "LMS Owner",
    description: "Learning management administration portal",
    url: "https://owner-lms.nex4.my/login",
    actionLabel: "Open LMS Owner",
  },
  {
    id: "crm",
    name: "NEX4 CRM",
    description: "Customer relationship management portal",
    url: "https://crm.nex4.my/login",
    actionLabel: "Open CRM",
  },
];

const timeoutMs = 8_000;

async function checkSystem(system: ManagedSystem): Promise<SystemStatus> {
  const startedAt = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(system.url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "NEX4-System-Monitor/1.0",
      },
    });

    await response.body?.cancel();

    return {
      ...system,
      online: response.ok,
      httpStatus: response.status,
      responseTimeMs: Math.round(performance.now() - startedAt),
      lastChecked: new Date().toISOString(),
    };
  } catch {
    return {
      ...system,
      online: false,
      httpStatus: null,
      responseTimeMs: null,
      lastChecked: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

export default defineCachedEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");

  const results = await Promise.all(systems.map(checkSystem));

  return {
    checkedAt: new Date().toISOString(),
    systems: results,
  };
}, {
  maxAge: 30,
  swr: false,
});
