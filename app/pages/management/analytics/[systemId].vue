<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

definePageMeta({ middleware: "management-auth" });

type SystemId = "landing" | "lms-owner" | "crm" | "nutritrack";
type RangeDays = 1 | 7 | 30;

type AnalyticsResponse = {
  system: { id: SystemId; name: string };
  rangeDays: number;
  generatedAt: string;
  summary: {
    pageViews: number;
    uniqueVisitors: number;
    sessions: number;
    newVisitors: number;
    returningVisitors: number;
    returningRate: number;
    pagesPerSession: number;
    averageSessionSeconds: number;
    lastEventAt: string | null;
  };
  daily: Array<{
    date: string;
    pageViews: number;
    uniqueVisitors: number;
    sessions: number;
    actions: number;
  }>;
  pages: Array<{
    path: string;
    pageViews: number;
    uniqueVisitors: number;
    entrances: number;
    exits: number;
  }>;
  actions: Array<{
    target: string;
    path: string;
    destination: string | null;
    clicks: number;
    uniqueVisitors: number;
  }>;
  devices: Array<{ id: string; events: number; uniqueVisitors: number }>;
  sources: Array<{ id: string; events: number; uniqueVisitors: number }>;
  recentEvents: Array<{
    occurredAt: string;
    type: "page_view" | "section_view" | "button_click";
    path: string;
    target: string | null;
    destination: string | null;
    device: string;
    source: string;
    visitor: string;
    session: string | null;
  }>;
  journeys: Array<{
    id: string;
    visitor: string;
    device: string;
    source: string;
    lastEventAt: string;
    events: Array<{
      occurredAt: string;
      type: "page_view" | "section_view" | "button_click";
      path: string;
      target: string | null;
      destination: string | null;
    }>;
  }>;
};

const route = useRoute();
const validIds: SystemId[] = ["landing", "lms-owner", "crm", "nutritrack"];
const systemId = computed(() => String(route.params.systemId) as SystemId);
if (!validIds.includes(systemId.value)) {
  throw createError({ statusCode: 404, statusMessage: "Analytics project not found" });
}

const themes: Record<SystemId, { accent: string; soft: string; label: string }> = {
  landing: { accent: "#dda812", soft: "221, 168, 18", label: "Landing" },
  "lms-owner": { accent: "#3b82f6", soft: "59, 130, 246", label: "LMS" },
  crm: { accent: "#8b5cf6", soft: "139, 92, 246", label: "CRM" },
  nutritrack: { accent: "#22c55e", soft: "34, 197, 94", label: "NutriTrack" },
};
const theme = computed(() => themes[systemId.value]);
const rangeDays = ref<RangeDays>(7);
const isTabVisible = ref(true);
const endpoint = computed(() => `/api/management/analytics/${systemId.value}`);

const { data, error, status, refresh } = useFetch<AnalyticsResponse>(endpoint, {
  cache: "no-store",
  lazy: true,
  server: false,
  query: computed(() => ({ days: rangeDays.value })),
});

const numberFormatter = new Intl.NumberFormat("en-MY", { notation: "compact" });
const dateTimeFormatter = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Kuala_Lumpur",
});
const dayFormatter = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "short",
  timeZone: "Asia/Kuala_Lumpur",
});

const summary = computed(() => data.value?.summary);
const maximumViews = computed(() => Math.max(...(data.value?.daily.map((day) => day.pageViews) ?? []), 1));
const maximumDimension = (items: Array<{ events: number }>) => Math.max(...items.map((item) => item.events), 1);

function barHeight(value: number) {
  return `${Math.max((value / maximumViews.value) * 100, value > 0 ? 8 : 2)}%`;
}

function duration(seconds: number) {
  if (seconds < 60) return `${Math.round(seconds)} sec`;
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);
  return `${minutes}m ${remainder}s`;
}

function eventLabel(type: string) {
  return {
    page_view: "Opened",
    button_click: "Clicked",
    section_view: "Viewed section",
  }[type] ?? type;
}

function displayTarget(target: string | null, path: string) {
  return (target ?? path).replaceAll(":", " · ").replaceAll("-", " ");
}

function onVisibilityChange() {
  isTabVisible.value = !document.hidden;
  if (isTabVisible.value) void refresh();
}

let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  isTabVisible.value = !document.hidden;
  document.addEventListener("visibilitychange", onVisibilityChange);
  timer = setInterval(() => {
    if (isTabVisible.value && status.value !== "pending") void refresh();
  }, 30_000);
});
onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", onVisibilityChange);
  if (timer) clearInterval(timer);
});

useSeoMeta({
  title: computed(() => `${data.value?.system.name ?? theme.value.label} Analytics — NEX4`),
  robots: "noindex, nofollow",
});
</script>

<template>
  <div
    class="analytics-page"
    :style="{ '--accent': theme.accent, '--accent-rgb': theme.soft }"
  >
    <div class="page-grid" aria-hidden="true" />
    <header class="detail-header">
      <div class="container header-inner">
        <NuxtLink to="/management" class="back-link">← Management</NuxtLink>
        <div class="live-status">
          <i :class="{ active: isTabVisible }" />
          {{ isTabVisible ? "Live · refreshes every 30s" : "Paused while hidden" }}
        </div>
      </div>
    </header>

    <main class="container detail-main">
      <section class="hero">
        <div>
          <p class="eyebrow"><span /> {{ theme.label }} intelligence</p>
          <h1>{{ data?.system.name ?? theme.label }}</h1>
          <p>Understand traffic, page openings, clicks and anonymous user journeys.</p>
        </div>
        <div class="hero-actions">
          <div class="range-switcher" role="group" aria-label="Reporting period">
            <button
              v-for="option in ([1, 7, 30] as RangeDays[])"
              :key="option"
              type="button"
              :class="{ active: rangeDays === option }"
              @click="rangeDays = option"
            >
              {{ option === 1 ? "Today" : `${option} days` }}
            </button>
          </div>
          <button class="refresh-button" type="button" :disabled="status === 'pending'" @click="refresh()">
            {{ status === "pending" ? "Updating…" : "Refresh" }}
          </button>
        </div>
      </section>

      <div class="freshness">
        <span v-if="data">Updated {{ dateTimeFormatter.format(new Date(data.generatedAt)) }}</span>
        <span>Anonymous, privacy-safe analytics</span>
      </div>

      <div v-if="error" class="error-banner" role="alert">
        Analytics could not be loaded. Existing project traffic is not affected.
      </div>

      <template v-if="summary">
        <section class="kpi-grid" aria-label="Traffic summary">
          <article><span>Page views</span><strong>{{ numberFormatter.format(summary.pageViews) }}</strong></article>
          <article><span>Unique visitors</span><strong>{{ numberFormatter.format(summary.uniqueVisitors) }}</strong></article>
          <article><span>Sessions</span><strong>{{ numberFormatter.format(summary.sessions) }}</strong></article>
          <article><span>New visitors</span><strong>{{ numberFormatter.format(summary.newVisitors) }}</strong></article>
          <article><span>Returning visitors</span><strong>{{ numberFormatter.format(summary.returningVisitors) }}</strong></article>
          <article><span>Returning rate</span><strong>{{ summary.returningRate.toFixed(1) }}%</strong></article>
          <article><span>Pages / session</span><strong>{{ summary.pagesPerSession.toFixed(1) }}</strong></article>
          <article><span>Avg. session</span><strong>{{ duration(summary.averageSessionSeconds) }}</strong></article>
        </section>

        <section class="panel trend-panel">
          <div class="panel-heading">
            <div><p class="panel-kicker">Traffic trend</p><h2>Views and actions</h2></div>
            <span>Selected {{ rangeDays === 1 ? "day" : `${rangeDays} days` }}</span>
          </div>
          <div class="trend-chart" :style="{ '--days': data?.daily.length ?? 1 }">
            <div v-for="day in data?.daily" :key="day.date" class="trend-column">
              <span>{{ day.pageViews }}</span>
              <div class="trend-track"><i :style="{ height: barHeight(day.pageViews) }" /></div>
              <small>{{ dayFormatter.format(new Date(`${day.date}T12:00:00+08:00`)) }}</small>
            </div>
          </div>
        </section>

        <section class="two-column">
          <article class="panel table-panel">
            <div class="panel-heading"><div><p class="panel-kicker">Content</p><h2>Most opened pages</h2></div></div>
            <div v-if="data?.pages.length" class="data-table">
              <div class="table-row table-head"><span>Page</span><span>Views</span><span>Entry</span><span>Exit</span></div>
              <div v-for="page in data.pages" :key="page.path" class="table-row">
                <strong :title="page.path">{{ page.path }}</strong>
                <span>{{ page.pageViews }}</span><span>{{ page.entrances }}</span><span>{{ page.exits }}</span>
              </div>
            </div>
            <p v-else class="empty">No page openings in this period.</p>
          </article>

          <article class="panel table-panel">
            <div class="panel-heading"><div><p class="panel-kicker">Engagement</p><h2>Most clicked actions</h2></div></div>
            <div v-if="data?.actions.length" class="action-list">
              <div v-for="action in data.actions" :key="`${action.path}:${action.target}:${action.destination}`">
                <div><strong>{{ displayTarget(action.target, action.path) }}</strong><small>{{ action.path }}<template v-if="action.destination"> → {{ action.destination }}</template></small></div>
                <span>{{ action.clicks }}</span>
              </div>
            </div>
            <p v-else class="empty">Click tracking is ready; waiting for tagged actions.</p>
          </article>
        </section>

        <section class="two-column">
          <article class="panel">
            <div class="panel-heading"><div><p class="panel-kicker">Audience</p><h2>Devices</h2></div></div>
            <div class="breakdown-list">
              <div v-for="item in data?.devices" :key="item.id">
                <span>{{ item.id }}</span><i><b :style="{ width: `${(item.events / maximumDimension(data?.devices ?? [])) * 100}%` }" /></i><strong>{{ item.events }}</strong>
              </div>
            </div>
          </article>
          <article class="panel">
            <div class="panel-heading"><div><p class="panel-kicker">Acquisition</p><h2>Traffic sources</h2></div></div>
            <div class="breakdown-list">
              <div v-for="item in data?.sources" :key="item.id">
                <span>{{ item.id }}</span><i><b :style="{ width: `${(item.events / maximumDimension(data?.sources ?? [])) * 100}%` }" /></i><strong>{{ item.events }}</strong>
              </div>
            </div>
          </article>
        </section>

        <section class="two-column activity-grid">
          <article class="panel">
            <div class="panel-heading"><div><p class="panel-kicker">Near-live</p><h2>Recent activity</h2></div><span>Latest 100</span></div>
            <div v-if="data?.recentEvents.length" class="event-list">
              <div v-for="item in data.recentEvents" :key="`${item.occurredAt}:${item.session}:${item.target}`">
                <i :class="item.type" />
                <div><strong>{{ eventLabel(item.type) }} · {{ displayTarget(item.target, item.path) }}</strong><small>{{ item.visitor }} · {{ item.device }} · {{ item.source }}</small></div>
                <time>{{ dateTimeFormatter.format(new Date(item.occurredAt)) }}</time>
              </div>
            </div>
            <p v-else class="empty">No recent activity in this period.</p>
          </article>

          <article class="panel">
            <div class="panel-heading"><div><p class="panel-kicker">Behaviour</p><h2>Anonymous journeys</h2></div><span>Latest 20 sessions</span></div>
            <div v-if="data?.journeys.length" class="journey-list">
              <details v-for="journey in data.journeys" :key="journey.id">
                <summary><span><strong>{{ journey.id }}</strong><small>{{ journey.visitor }} · {{ journey.device }} · {{ journey.source }}</small></span><b>{{ journey.events.length }} events</b></summary>
                <ol>
                  <li v-for="item in journey.events" :key="`${item.occurredAt}:${item.target}`">
                    <time>{{ dateTimeFormatter.format(new Date(item.occurredAt)) }}</time>
                    <span>{{ eventLabel(item.type) }} <strong>{{ displayTarget(item.target, item.path) }}</strong><small v-if="item.destination">to {{ item.destination }}</small></span>
                  </li>
                </ol>
              </details>
            </div>
            <p v-else class="empty">Journeys appear after sessions send activity.</p>
          </article>
        </section>
      </template>

      <div v-else-if="status === 'pending'" class="loading-state">Loading project intelligence…</div>
    </main>
  </div>
</template>

<style scoped>
.analytics-page { --accent: #dda812; --accent-rgb: 221, 168, 18; min-height: 100vh; color: #f8fafc; background: #03050a; }
.page-grid { position: fixed; inset: 0; pointer-events: none; opacity: .5; background-image: linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px),radial-gradient(circle at 70% 0,rgba(var(--accent-rgb),.13),transparent 42%); background-size: 64px 64px,64px 64px,100% 100%; }
.detail-header { position: relative; z-index: 2; border-bottom: 1px solid rgba(255,255,255,.08); background: rgba(3,5,10,.75); backdrop-filter: blur(18px); }
.header-inner { min-height: 70px; display: flex; align-items: center; justify-content: space-between; }
.back-link { color: #cbd5e1; font-size: 13px; font-weight: 750; }
.live-status { display: flex; align-items: center; gap: 8px; color: #94a3b8; font-size: 11px; }
.live-status i { width: 7px; height: 7px; border-radius: 50%; background: #64748b; }
.live-status i.active { background: #34d399; box-shadow: 0 0 12px #34d399; }
.detail-main { position: relative; z-index: 1; padding-top: 58px; padding-bottom: 80px; }
.hero { display: flex; align-items: flex-end; justify-content: space-between; gap: 28px; }
.eyebrow,.panel-kicker { color: var(--accent); font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; }
.eyebrow { display: flex; align-items: center; gap: 9px; margin-bottom: 14px; }
.eyebrow span { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 14px rgba(var(--accent-rgb),.8); }
h1 { font-family: "Manrope",sans-serif; font-size: clamp(42px,6vw,72px); font-weight: 600; line-height: 1; letter-spacing: -3px; }
.hero > div > p:last-child { max-width: 620px; margin-top: 17px; color: #94a3b8; }
.hero-actions { display: flex; align-items: center; gap: 10px; }
.range-switcher { display: flex; padding: 3px; border: 1px solid rgba(255,255,255,.1); border-radius: 12px; background: rgba(9,14,24,.8); }
.range-switcher button,.refresh-button { min-height: 39px; padding: 0 13px; border: 0; border-radius: 9px; background: transparent; color: #94a3b8; font-size: 11px; font-weight: 750; }
.range-switcher button.active { color: #fff; background: rgba(var(--accent-rgb),.16); box-shadow: inset 0 0 0 1px rgba(var(--accent-rgb),.25); }
.refresh-button { border: 1px solid rgba(255,255,255,.1); color: #e2e8f0; }
.refresh-button:disabled { opacity: .55; }
.freshness { display: flex; justify-content: space-between; margin: 18px 0 28px; color: #64748b; font-size: 10px; }
.kpi-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; }
.kpi-grid article,.panel { border: 1px solid rgba(255,255,255,.085); border-radius: 18px; background: linear-gradient(145deg,rgba(15,23,42,.8),rgba(5,8,15,.9)); box-shadow: inset 0 1px rgba(255,255,255,.035),0 18px 60px rgba(0,0,0,.18); }
.kpi-grid article { min-height: 118px; display: flex; flex-direction: column; justify-content: center; padding: 20px; }
.kpi-grid span { color: #64748b; font-size: 10px; font-weight: 700; letter-spacing: .7px; text-transform: uppercase; }
.kpi-grid strong { margin-top: 7px; color: var(--accent); font-family: "Manrope",sans-serif; font-size: 25px; }
.panel { padding: 24px; }
.trend-panel { margin-top: 18px; }
.panel-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
.panel-heading h2 { margin-top: 4px; font-family: "Manrope",sans-serif; font-size: 19px; }
.panel-heading > span { color: #64748b; font-size: 10px; }
.trend-chart { height: 190px; display: grid; grid-template-columns: repeat(var(--days),minmax(28px,1fr)); gap: 9px; overflow-x: auto; }
.trend-column { min-width: 28px; display: grid; grid-template-rows: 16px 1fr 18px; gap: 5px; text-align: center; }
.trend-column > span,.trend-column small { color: #64748b; font-size: 9px; }
.trend-track { position: relative; overflow: hidden; border-radius: 6px; background: rgba(255,255,255,.035); }
.trend-track i { position: absolute; right: 0; bottom: 0; left: 0; border-radius: 6px; background: linear-gradient(to top,rgba(var(--accent-rgb),.52),var(--accent)); }
.two-column { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px; margin-top: 18px; }
.data-table { display: grid; }
.table-row { min-width: 0; display: grid; grid-template-columns: minmax(0,1fr) repeat(3,50px); gap: 10px; align-items: center; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,.055); color: #94a3b8; font-size: 11px; text-align: right; }
.table-row:last-child { border-bottom: 0; }
.table-row strong,.table-row > span:first-child { overflow: hidden; color: #e2e8f0; text-align: left; text-overflow: ellipsis; white-space: nowrap; }
.table-head { padding-top: 0; color: #64748b; font-size: 8px; font-weight: 700; letter-spacing: .7px; text-transform: uppercase; }
.action-list,.event-list,.journey-list,.breakdown-list { display: grid; gap: 9px; }
.action-list > div { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,.055); }
.action-list > div:last-child { border-bottom: 0; }
.action-list strong,.action-list small { display: block; }
.action-list strong { color: #e2e8f0; font-size: 11px; text-transform: capitalize; }
.action-list small { max-width: 360px; overflow: hidden; margin-top: 3px; color: #64748b; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
.action-list > div > span { color: var(--accent); font-weight: 800; }
.breakdown-list > div { display: grid; grid-template-columns: 100px 1fr 44px; align-items: center; gap: 12px; color: #94a3b8; font-size: 11px; text-transform: capitalize; }
.breakdown-list i { height: 6px; overflow: hidden; border-radius: 99px; background: rgba(255,255,255,.045); }
.breakdown-list b { height: 100%; display: block; border-radius: inherit; background: var(--accent); }
.breakdown-list strong { color: #e2e8f0; text-align: right; }
.activity-grid { align-items: start; }
.event-list { max-height: 590px; overflow-y: auto; padding-right: 5px; }
.event-list > div { display: grid; grid-template-columns: 8px minmax(0,1fr) auto; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.05); }
.event-list i { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
.event-list i.page_view { background: #38bdf8; }.event-list i.section_view { background: #a78bfa; }
.event-list strong,.event-list small { display: block; }
.event-list strong { overflow: hidden; color: #cbd5e1; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; text-transform: capitalize; }
.event-list small,.event-list time { color: #64748b; font-size: 8px; }
.journey-list details { border: 1px solid rgba(255,255,255,.07); border-radius: 12px; background: rgba(255,255,255,.02); }
.journey-list summary { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px; cursor: pointer; list-style: none; }
.journey-list summary strong,.journey-list summary small { display: block; }
.journey-list summary strong { color: #e2e8f0; font-size: 10px; }.journey-list summary small { margin-top: 3px; color: #64748b; font-size: 8px; }
.journey-list summary b { color: var(--accent); font-size: 9px; }
.journey-list ol { display: grid; gap: 12px; margin: 0 13px 13px 30px; padding-top: 13px; border-top: 1px solid rgba(255,255,255,.06); }
.journey-list li { color: #94a3b8; font-size: 9px; }.journey-list li time { display: block; color: #64748b; font-size: 8px; }.journey-list li strong { color: #e2e8f0; text-transform: capitalize; }.journey-list li small { display: block; color: #64748b; }
.empty,.loading-state { padding: 34px 0; color: #64748b; font-size: 11px; text-align: center; }
.loading-state { margin-top: 30px; border: 1px solid rgba(255,255,255,.08); border-radius: 18px; }
.error-banner { margin-bottom: 20px; padding: 14px 17px; border: 1px solid rgba(248,113,113,.25); border-radius: 12px; color: #fca5a5; background: rgba(127,29,29,.15); font-size: 12px; }
@media (max-width: 1000px) { .kpi-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }.two-column { grid-template-columns: 1fr; } }
@media (max-width: 680px) { .detail-main { padding-top: 40px; }.hero { align-items: flex-start; flex-direction: column; }.hero-actions,.range-switcher { width: 100%; }.range-switcher button { flex: 1; }.freshness { align-items: flex-start; flex-direction: column; gap: 4px; }.kpi-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }.kpi-grid article { min-height: 102px; padding: 16px; }.kpi-grid strong { font-size: 20px; }.panel { padding: 18px; }.table-row { grid-template-columns: minmax(0,1fr) repeat(3,40px); }.event-list > div { grid-template-columns: 8px minmax(0,1fr); }.event-list time { grid-column: 2; }.header-inner { min-height: 62px; } }
</style>
