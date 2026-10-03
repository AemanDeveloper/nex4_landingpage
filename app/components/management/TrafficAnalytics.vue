<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";

type DailyTraffic = {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
};

type TrafficSystem = {
  id: "lms-owner" | "crm" | "nutritrack";
  name: string;
  connected: boolean;
  lastEventAt: string | null;
  totals: {
    pageViews: number;
    uniqueVisitors: number;
    sessions: number;
  };
  daily: DailyTraffic[];
};

type AnalyticsResponse = {
  rangeDays: number;
  generatedAt: string;
  systems: TrafficSystem[];
};

const { data, error, status, refresh } = await useFetch<AnalyticsResponse>(
  "/api/management/analytics",
  { cache: "no-store" },
);

const systems = computed(() => data.value?.systems ?? []);
const numberFormatter = new Intl.NumberFormat("en-MY", { notation: "compact" });
const dayFormatter = new Intl.DateTimeFormat("en-MY", {
  weekday: "short",
  timeZone: "Asia/Kuala_Lumpur",
});

function barHeight(system: TrafficSystem, value: number) {
  const maximum = Math.max(...system.daily.map((day) => day.pageViews), 1);
  return `${Math.max((value / maximum) * 100, value > 0 ? 8 : 2)}%`;
}

function formatDay(value: string) {
  return dayFormatter.format(new Date(`${value}T12:00:00+08:00`));
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
        <h2 id="traffic-title">Last 7 days</h2>
      </div>
      <span class="privacy-note">Anonymous aggregate data only</span>
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
            <dt>Page views</dt>
            <dd>{{ numberFormatter.format(system.totals.pageViews) }}</dd>
          </div>
          <div>
            <dt>Visitors</dt>
            <dd>{{ numberFormatter.format(system.totals.uniqueVisitors) }}</dd>
          </div>
          <div>
            <dt>Sessions</dt>
            <dd>{{ numberFormatter.format(system.totals.sessions) }}</dd>
          </div>
        </dl>

        <div class="traffic-chart" aria-label="Daily page views">
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
  </section>
</template>

<style scoped>
.traffic-section {
  margin-top: 72px;
}

.traffic-heading {
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

.privacy-note {
  color: var(--nex4-text-muted);
  font-size: 11px;
}

.traffic-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.traffic-card {
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

.traffic-card h3 {
  font-family: "Manrope", sans-serif;
  font-size: 16px;
}

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

.traffic-totals dt {
  color: var(--nex4-text-muted);
  font-size: 10px;
}

.traffic-totals dd {
  margin-top: 5px;
  font-family: "Manrope", sans-serif;
  font-size: 20px;
  font-weight: 750;
}

.traffic-chart {
  height: 118px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

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

.analytics-error {
  margin-bottom: 16px;
  padding: 14px 18px;
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: 12px;
  color: #fca5a5;
  font-size: 12px;
}

@media (max-width: 1000px) {
  .traffic-grid { grid-template-columns: 1fr; }
}

@media (max-width: 650px) {
  .traffic-heading { align-items: flex-start; flex-direction: column; }
  .traffic-card { padding: 20px; }
}
</style>
