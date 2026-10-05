type EventType = "page_view" | "section_view" | "button_click";
type DeviceType = "desktop" | "tablet" | "mobile";

const visitorStorageKey = "nex4:landing:visitor:v1";
const sessionStorageKey = "nex4:landing:session:v1";
const sourceStorageKey = "nex4:landing:source:v1";

function createAnonymousId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

function readOrCreateId(storage: Storage, key: string) {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const created = createAnonymousId();
  storage.setItem(key, created);
  return created;
}

function normalizeLabel(value: string, fallback: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/[^a-z0-9._:-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return normalized || fallback;
}

function trafficSource() {
  const existing = sessionStorage.getItem(sourceStorageKey);
  if (existing) return existing;

  const utmSource = new URLSearchParams(location.search).get("utm_source");
  let source = utmSource
    ? `utm:${normalizeLabel(utmSource, "campaign")}`.slice(0, 120)
    : "direct";

  if (!utmSource && document.referrer) {
    try {
      const referrer = new URL(document.referrer);
      const referrerHost = referrer.hostname.replace(/^www\./, "");
      const currentHost = location.hostname.replace(/^www\./, "");
      source = referrerHost === currentHost
        ? "internal"
        : normalizeLabel(referrerHost, "referral");
    } catch {
      source = "referral";
    }
  }

  sessionStorage.setItem(sourceStorageKey, source);
  return source;
}

function deviceType(): DeviceType {
  if (window.innerWidth <= 767) return "mobile";
  if (window.innerWidth <= 1024) return "tablet";
  return "desktop";
}

function interactionTarget(element: HTMLAnchorElement | HTMLButtonElement) {
  const section = element.closest<HTMLElement>("section[id]")?.id;
  const scope = section
    ?? (element.closest("header") ? "navigation" : undefined)
    ?? (element.closest("footer") ? "footer" : undefined)
    ?? "page";
  const label = element.getAttribute("aria-label")
    ?? element.textContent
    ?? element.getAttribute("href")
    ?? element.tagName;
  const kind = element instanceof HTMLButtonElement ? "button" : "link";
  return `${scope}:${kind}:${normalizeLabel(label, "unnamed")}`.slice(0, 120);
}

export default defineNuxtPlugin((nuxtApp) => {
  const route = useRoute();
  if (route.path !== "/") return;

  const visitorId = readOrCreateId(localStorage, visitorStorageKey);
  const sessionId = readOrCreateId(sessionStorage, sessionStorageKey);
  const source = trafficSource();
  const seenSections = new Set<string>();

  function send(eventType: EventType, targetId?: string) {
    void fetch("/api/telemetry/landing", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventType,
        path: route.path,
        targetId,
        deviceType: deviceType(),
        source,
        visitorId,
        sessionId,
      }),
      credentials: "same-origin",
      referrerPolicy: "no-referrer",
      keepalive: true,
    }).catch(() => undefined);
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.3) continue;
        const sectionId = (entry.target as HTMLElement).id;
        if (!sectionId || seenSections.has(sectionId)) continue;
        seenSections.add(sectionId);
        send("section_view", sectionId);
        sectionObserver.unobserve(entry.target);
      }
    },
    { threshold: [0.3] },
  );

  function onClick(event: MouseEvent) {
    if (route.path !== "/") return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const control = target.closest<HTMLAnchorElement | HTMLButtonElement>("a, button");
    if (!control) return;
    send("button_click", interactionTarget(control));
  }

  nuxtApp.hook("app:mounted", () => {
    send("page_view");
    document.querySelectorAll<HTMLElement>("main section[id]").forEach((section) => {
      sectionObserver.observe(section);
    });
    document.addEventListener("click", onClick, { capture: true });
  });
});
