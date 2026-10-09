<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type DailyTraffic = {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
};

type TrafficSystem = {
  id: "landing" | "lms-owner" | "crm" | "nutritrack";
  name: string;
  connected: boolean;
  lastEventAt: string | null;
  totals: {
    pageViews: number;
    uniqueVisitors: number;
    sessions: number;
  };
  visitorBreakdown: {
    newVisitors: number;
    returningVisitors: number;
    returningRate: number;
  };
  daily: DailyTraffic[];
};

type InteractionMetric = {
  id: string;
  views: number;
  uniqueVisitors: number;
};

type DimensionMetric = {
  id: string;
  pageViews: number;
  uniqueVisitors: number;
};

type AnalyticsResponse = {
  rangeDays: number;
  generatedAt: string;
  systems: TrafficSystem[];
  landing: {
    sections: InteractionMetric[];
    buttons: InteractionMetric[];
    devices: DimensionMetric[];
    sources: DimensionMetric[];
  };
  lms: {
    pages: DimensionMetric[];
  };
};

type RangeDays = 1 | 7 | 30;

const rangeOptions: { days: RangeDays; label: string; description: string }[] = [
  { days: 1, label: "Today", description: "Daily" },
  { days: 7, label: "Last 7 days", description: "Weekly" },
  { days: 30, label: "Last 30 days", description: "Monthly" },
];

const selectedRange = ref<RangeDays>(7);

const { data, error, status, refresh } = useFetch<AnalyticsResponse>(
  "/api/management/analytics",
  {
    cache: "no-store",
    lazy: true,
    server: false,
    query: computed(() => ({ days: selectedRange.value })),
  },
);

const systems = computed(() => data.value?.systems ?? []);
const landing = computed(() => data.value?.landing);
const lms = computed(() => data.value?.lms);
const numberFormatter = new Intl.NumberFormat("en-MY", { notation: "compact" });
const dayFormatter = new Intl.DateTimeFormat("en-MY", {
  weekday: "short",
  timeZone: "Asia/Kuala_Lumpur",
});
const shortDateFormatter = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "short",
  timeZone: "Asia/Kuala_Lumpur",
});
const fullDateFormatter = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kuala_Lumpur",
});
const updatedFormatter = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Kuala_Lumpur",
});

const activeRange = computed(
  () => rangeOptions.find((option) => option.days === selectedRange.value)!,
);
const reportDateRange = computed(() => {
  const days = systems.value[0]?.daily ?? [];
  if (!days.length) return "Loading reporting dates…";

  const start = new Date(`${days[0].date}T12:00:00+08:00`);
  const end = new Date(`${days.at(-1)!.date}T12:00:00+08:00`);
  if (days.length === 1) return fullDateFormatter.format(end);
  return `${shortDateFormatter.format(start)} – ${fullDateFormatter.format(end)}`;
});
const lastUpdated = computed(() =>
  data.value?.generatedAt
    ? `Updated ${updatedFormatter.format(new Date(data.value.generatedAt))}`
    : "",
);

function barHeight(system: TrafficSystem, value: number) {
  const maximum = Math.max(...system.daily.map((day) => day.pageViews), 1);
  return `${Math.max((value / maximum) * 100, value > 0 ? 8 : 2)}%`;
}

function formatDay(value: string) {
  const date = new Date(`${value}T12:00:00+08:00`);
  if (selectedRange.value === 1) return "Today";
  if (selectedRange.value === 7) return dayFormatter.format(date);
  return shortDateFormatter.format(date);
}

function formatLabel(value: string) {
  const deviceLabels: Record<string, string> = {
    desktop: "Desktop / web",
    tablet: "Tablet",
    mobile: "Mobile",
    unknown: "Unknown",
    direct: "Direct",
    internal: "Internal",
    referral: "Referral",
  };
  if (deviceLabels[value]) return deviceLabels[value];
  if (value.startsWith("utm:")) return `Campaign · ${value.slice(4)}`;
  return value.replaceAll(":", " · ").replaceAll("-", " ");
}

let refreshTimer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  refreshTimer = setInterval(() => refresh(), 60_000);
});
onBeforeUnmount(() => clearInterval(refreshTimer));
</script>

<template>
  <section class="traffic-section" aria-labelledby="traffic-title">
    <div class="traffic-heading">
      <div>
        <p class="traffic-eyebrow">Traffic analytics</p>
        <h2 id="traffic-title">Traffic overview</h2>
      </div>
      <div class="range-switcher" role="group" aria-label="Analytics reporting period">
        <button
          v-for="option in rangeOptions"
          :key="option.days"
          type="button"
          :class="{ active: selectedRange === option.days }"
          :aria-pressed="selectedRange === option.days"
          @click="selectedRange = option.days"
        >
          <span>{{ option.label }}</span>
          <small>{{ option.description }}</small>
        </button>
      </div>
    </div>

    <div class="report-context">
      <div>
        <strong>{{ activeRange.label }}</strong>
        <span>{{ reportDateRange }}</span>
      </div>
      <span>{{ lastUpdated }} · Anonymous aggregate data only</span>
    </div>

    <div v-if="error" class="analytics-error" role="alert">
      Traffic analytics are temporarily unavailable.
    </div>

    <div class="traffic-grid" :aria-busy="status === 'pending'">
      <article v-for="system in systems" :key="system.id" class="traffic-card">
        <header>
          <h3>{{ system.name }}</h3>
          <span :class="system.connected ? 'connected' : 'awaiting'">
            <i />
            {{ system.connected ? "Connected" : "Awaiting connection" }}
          </span>
        </header>

        <dl class="traffic-totals">
          <div>
            <dt>Page views <small>Total page loads</small></dt>
            <dd>{{ numberFormatter.format(system.totals.pageViews) }}</dd>
          </div>
          <div>
            <dt>Unique visitors <small>Estimated individual browsers</small></dt>
            <dd>{{ numberFormatter.format(system.totals.uniqueVisitors) }}</dd>
          </div>
          <div>
            <dt>Sessions <small>Separate browsing visits</small></dt>
            <dd>{{ numberFormatter.format(system.totals.sessions) }}</dd>
          </div>
        </dl>

        <div class="visitor-breakdown">
          <div class="visitor-breakdown-heading">
            <strong>Visitor mix</strong>
            <span>Based on first recorded anonymous visit</span>
          </div>
          <dl>
            <div>
              <dt>New visitors <small>First recorded in this period</small></dt>
              <dd>{{ numberFormatter.format(system.visitorBreakdown.newVisitors) }}</dd>
            </div>
            <div>
              <dt>Returning visitors <small>Seen before this period, then returned</small></dt>
              <dd>{{ numberFormatter.format(system.visitorBreakdown.returningVisitors) }}</dd>
            </div>
            <div>
              <dt>Returning rate <small>Returning share of unique visitors</small></dt>
              <dd>{{ system.visitorBreakdown.returningRate.toFixed(1) }}%</dd>
            </div>
          </dl>
        </div>

        <div
          class="traffic-chart"
          :class="{ 'single-day': system.daily.length === 1 }"
          :style="{ '--chart-days': system.daily.length }"
          :aria-label="`Daily page views for ${activeRange.label.toLowerCase()}`"
        >
          <div v-for="day in system.daily" :key="day.date" class="bar-column">
            <span class="bar-value">{{ day.pageViews }}</span>
            <div class="bar-track">
              <i :style="{ height: barHeight(system, day.pageViews) }" />
            </div>
            <span class="bar-day">{{ formatDay(day.date) }}</span>
          </div>
        </div>
      </article>
    </div>

    <div v-if="landing" class="landing-detail">
      <div class="detail-heading">
        <div>
          <p class="traffic-eyebrow">NEX4 landing engagement</p>
          <h3>Sections, actions and audience</h3>
        </div>
        <span>Counts reflect {{ activeRange.label.toLowerCase() }}</span>
      </div>

      <div class="detail-grid">
        <article class="detail-card">
          <h4>Section views</h4>
          <p class="detail-caption">Seen at least 30% in the viewport</p>
          <ol v-if="landing.sections.length" class="metric-list">
            <li v-for="item in landing.sections" :key="item.id">
              <span>{{ formatLabel(item.id) }}</span>
              <strong>{{ numberFormatter.format(item.views) }}</strong>
            </li>
          </ol>
          <p v-else class="empty-metric">Waiting for section views</p>
        </article>

        <article class="detail-card">
          <h4>Button and link clicks</h4>
          <p class="detail-caption">Grouped by page area and label</p>
          <ol v-if="landing.buttons.length" class="metric-list">
            <li v-for="item in landing.buttons" :key="item.id">
              <span>{{ formatLabel(item.id) }}</span>
              <strong>{{ numberFormatter.format(item.views) }}</strong>
            </li>
          </ol>
          <p v-else class="empty-metric">Waiting for interactions</p>
        </article>

        <article class="detail-card">
          <h4>Device usage</h4>
          <p class="detail-caption">Landing page views by viewport</p>
          <ol v-if="landing.devices.length" class="metric-list">
            <li v-for="item in landing.devices" :key="item.id">
              <span>{{ formatLabel(item.id) }}</span>
              <strong>{{ numberFormatter.format(item.pageViews) }}</strong>
            </li>
          </ol>
          <p v-else class="empty-metric">Waiting for page views</p>
        </article>

        <article class="detail-card">
          <h4>Traffic source</h4>
          <p class="detail-caption">UTM source, referrer host or direct</p>
          <ol v-if="landing.sources.length" class="metric-list">
            <li v-for="item in landing.sources" :key="item.id">
              <span>{{ formatLabel(item.id) }}</span>
              <strong>{{ numberFormatter.format(item.pageViews) }}</strong>
            </li>
          </ol>
          <p v-else class="empty-metric">Waiting for page views</p>
        </article>
      </div>
    </div>

    <div v-if="lms" class="landing-detail">
      <div class="detail-heading">
        <div>
          <p class="traffic-eyebrow">LMS user behaviour</p>
          <h3>User pages only</h3>
        </div>
        <span>Owner Console activity is excluded</span>
      </div>

      <div class="detail-grid lms-detail-grid">
        <article class="detail-card">
          <h4>Most viewed LMS pages</h4>
          <p class="detail-caption">All user-facing routes, grouped by page path</p>
          <ol v-if="lms.pages.length" class="metric-list">
            <li v-for="item in lms.pages" :key="item.id">
              <span>{{ item.id }}</span>
              <strong>{{ numberFormatter.format(item.pageViews) }}</strong>
            </li>
          </ol>
          <p v-else class="empty-metric">Waiting for new LMS user activity</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.traffic-section { margin-top: 72px; }
.traffic-heading,
.detail-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}
.traffic-eyebrow {
  margin-bottom: 6px;
  color: var(--nex4-green-bright);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}
.traffic-heading h2 {
  font-family: "Manrope", sans-serif;
  font-size: 30px;
  letter-spacing: -1px;
}
.range-switcher {
  display: inline-grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  overflow: hidden;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 13px;
  background: rgba(5, 8, 15, 0.78);
}
.range-switcher button {
  min-width: 104px;
  padding: 8px 13px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--nex4-text-muted);
  text-align: left;
  transition: background 180ms ease, color 180ms ease;
}
.range-switcher button span,
.range-switcher button small { display: block; }
.range-switcher button span { font-size: 11px; font-weight: 750; }
.range-switcher button small { margin-top: 1px; font-size: 9px; opacity: 0.65; }
.range-switcher button.active {
  background: rgba(221, 168, 18, 0.14);
  color: var(--nex4-text);
  box-shadow: inset 0 0 0 1px rgba(221, 168, 18, 0.24);
}
.report-context {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin: -8px 0 22px;
  color: var(--nex4-text-muted);
  font-size: 10px;
}
.report-context > div { display: flex; align-items: center; gap: 9px; }
.report-context strong { color: var(--nex4-text-secondary); font-size: 11px; }
.privacy-note,
.detail-heading > span,
.detail-caption,
.empty-metric {
  color: var(--nex4-text-muted);
  font-size: 11px;
}
.traffic-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.traffic-card,
.detail-card {
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  background: rgba(9, 14, 24, 0.78);
}
.traffic-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.traffic-card h3,
.detail-heading h3 {
  font-family: "Manrope", sans-serif;
  font-size: 16px;
}
.detail-heading h3 { font-size: 24px; }
.traffic-card header span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
}
.traffic-card header i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.connected { color: #6ee7b7; }
.connected i { background: #34d399; }
.awaiting { color: #fbbf24; }
.awaiting i { background: #f59e0b; }
.traffic-totals {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 24px 0 28px;
}
.traffic-totals dt { color: var(--nex4-text-muted); font-size: 10px; line-height: 1.35; }
.traffic-totals dt small { display: block; margin-top: 2px; font-size: 8px; opacity: 0.65; }
.traffic-totals dd {
  margin-top: 5px;
  font-family: "Manrope", sans-serif;
  font-size: 20px;
  font-weight: 750;
}
.visitor-breakdown {
  margin: -8px 0 26px;
  padding: 14px 16px;
  border: 1px solid rgba(221, 168, 18, 0.14);
  border-radius: 13px;
  background: rgba(221, 168, 18, 0.035);
}
.visitor-breakdown-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 13px;
}
.visitor-breakdown-heading strong {
  color: var(--nex4-text-secondary);
  font-size: 11px;
}
.visitor-breakdown-heading span {
  color: var(--nex4-text-muted);
  font-size: 8px;
}
.visitor-breakdown dl {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.visitor-breakdown dt {
  color: var(--nex4-text-muted);
  font-size: 9px;
  line-height: 1.35;
}
.visitor-breakdown dt small {
  display: block;
  margin-top: 2px;
  font-size: 7px;
  opacity: 0.65;
}
.visitor-breakdown dd {
  margin-top: 5px;
  color: var(--nex4-gold, #dda812);
  font-family: "Manrope", sans-serif;
  font-size: 16px;
  font-weight: 750;
}
.traffic-chart {
  height: 118px;
  display: grid;
  grid-template-columns: repeat(var(--chart-days), minmax(28px, 1fr));
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.traffic-chart.single-day { grid-template-columns: minmax(48px, 72px); }
.bar-column {
  min-width: 0;
  display: grid;
  grid-template-rows: 16px 1fr 16px;
  gap: 5px;
  text-align: center;
}
.bar-value,
.bar-day {
  overflow: hidden;
  color: var(--nex4-text-muted);
  font-size: 9px;
  text-overflow: ellipsis;
}
.bar-track {
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.035);
}
.bar-track i {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 5px;
  background: linear-gradient(to top, var(--nex4-green), var(--nex4-green-bright));
  opacity: 0.85;
}
.landing-detail { margin-top: 34px; }
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.lms-detail-grid { grid-template-columns: minmax(0, 1fr); }
.detail-card h4 { font-family: "Manrope", sans-serif; font-size: 15px; }
.detail-caption { margin-top: 5px; }
.metric-list {
  display: grid;
  gap: 8px;
  margin-top: 18px;
  list-style: none;
}
.metric-list li {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.055);
}
.metric-list li:last-child { padding-bottom: 0; border-bottom: 0; }
.metric-list span {
  overflow: hidden;
  color: var(--nex4-text-secondary);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.metric-list strong {
  color: var(--nex4-green-bright);
  font-family: "Manrope", sans-serif;
  font-size: 13px;
}
.empty-metric { margin-top: 20px; }
.analytics-error {
  margin-bottom: 16px;
  padding: 14px 18px;
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: 12px;
  color: #fca5a5;
  font-size: 12px;
}
@media (max-width: 1000px) {
  .traffic-grid,
  .detail-grid { grid-template-columns: 1fr; }
}
@media (max-width: 650px) {
  .traffic-heading,
  .detail-heading { align-items: flex-start; flex-direction: column; }
  .traffic-card,
  .detail-card { padding: 20px; }
  .range-switcher { width: 100%; }
  .range-switcher button { min-width: 0; padding: 8px; text-align: center; }
  .report-context { align-items: flex-start; flex-direction: column; gap: 5px; }
  .traffic-totals { grid-template-columns: 1fr; }
  .traffic-totals > div { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .traffic-totals dd { margin-top: 0; }
  .visitor-breakdown-heading { align-items: flex-start; flex-direction: column; gap: 3px; }
  .visitor-breakdown dl { grid-template-columns: 1fr; }
  .visitor-breakdown dl > div { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .visitor-breakdown dd { margin-top: 0; }
}
</style>
