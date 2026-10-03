<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";

definePageMeta({
  middleware: "management-auth",
});

type SystemStatus = {
  id: "lms-owner" | "crm" | "nutritrack";
  name: string;
  description: string;
  url: string;
  actionLabel: string | null;
  online: boolean;
  httpStatus: number | null;
  responseTimeMs: number | null;
  lastChecked: string;
};

type StatusResponse = {
  checkedAt: string;
  systems: SystemStatus[];
};

const { data, error, status, refresh } = await useFetch<StatusResponse>(
  "/api/management/status",
  { cache: "no-store" },
);

const systems = computed(() => data.value?.systems ?? []);
const onlineCount = computed(
  () => systems.value.filter((system) => system.online).length,
);
const isRefreshing = computed(() => status.value === "pending");

const dateFormatter = new Intl.DateTimeFormat("en-MY", {
  dateStyle: "medium",
  timeStyle: "medium",
  timeZone: "Asia/Kuala_Lumpur",
});

function formatCheckedAt(value: string) {
  return dateFormatter.format(new Date(value));
}

function systemIcon(id: SystemStatus["id"]) {
  return {
    "lms-owner": "LMS",
    crm: "CRM",
    nutritrack: "NUTRI",
  }[id];
}

async function logout() {
  await $fetch("/api/management/logout", { method: "POST" });
  await navigateTo("/management/login");
}

let refreshTimer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  refreshTimer = setInterval(() => refresh(), 60_000);
});

onBeforeUnmount(() => clearInterval(refreshTimer));

useSeoMeta({
  title: "System Management — NEX4",
  description: "NEX4 management systems status dashboard.",
  robots: "noindex, nofollow",
});
</script>

<template>
  <div class="management-page">
    <div class="management-grid" aria-hidden="true" />
    <div class="management-glow" aria-hidden="true" />

    <header class="management-header">
      <div class="container header-inner">
        <NuxtLink to="/" class="brand" aria-label="Back to NEX4 home">
          <img src="/images/nex4-icon.png" alt="" />
          <span>NEX4</span>
        </NuxtLink>

        <div class="header-actions">
          <span class="area-label">System Management</span>
          <button class="logout-button" type="button" @click="logout">
            Log out
          </button>
        </div>
      </div>
    </header>

    <main class="container management-main">
      <section class="overview" aria-labelledby="management-title">
        <div>
          <p class="eyebrow"><span /> Management Console</p>
          <h1 id="management-title">Systems overview</h1>
          <p class="intro">
            Live availability checks for NEX4 management platforms. Checks run
            securely from the NEX4 server and refresh automatically every minute.
          </p>
        </div>

        <button
          class="refresh-button"
          type="button"
          :disabled="isRefreshing"
          @click="refresh"
        >
          <span :class="{ spinning: isRefreshing }">↻</span>
          {{ isRefreshing ? "Checking…" : "Refresh status" }}
        </button>
      </section>

      <section class="summary" aria-label="System summary">
        <div>
          <span>Total systems</span>
          <strong>{{ systems.length }}</strong>
        </div>
        <div>
          <span>Systems online</span>
          <strong>{{ onlineCount }}</strong>
        </div>
        <div>
          <span>Last refresh</span>
          <strong class="summary-time">
            {{ data?.checkedAt ? formatCheckedAt(data.checkedAt) : "Checking…" }}
          </strong>
        </div>
      </section>

      <div v-if="error" class="error-banner" role="alert">
        Status data is temporarily unavailable. Please try refreshing the dashboard.
      </div>

      <section class="systems" aria-label="Managed systems">
        <article
          v-for="system in systems"
          :key="system.id"
          class="system-card"
        >
          <div class="card-heading">
            <div class="system-icon" aria-hidden="true">
              {{ systemIcon(system.id) }}
            </div>
            <div>
              <p>{{ system.description }}</p>
              <h2>{{ system.name }}</h2>
            </div>
            <span
              class="status-badge"
              :class="system.online ? 'status-online' : 'status-offline'"
            >
              <i />
              {{ system.online ? "Online" : "Offline" }}
            </span>
          </div>

          <dl class="metrics">
            <div>
              <dt>HTTP status</dt>
              <dd>{{ system.httpStatus ?? "Unavailable" }}</dd>
            </div>
            <div>
              <dt>Response time</dt>
              <dd>
                {{
                  system.responseTimeMs === null
                    ? "Unavailable"
                    : `${system.responseTimeMs} ms`
                }}
              </dd>
            </div>
            <div>
              <dt>Last checked</dt>
              <dd>{{ formatCheckedAt(system.lastChecked) }}</dd>
            </div>
          </dl>

          <a
            v-if="system.actionLabel"
            class="open-button"
            :href="system.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${system.actionLabel} in a new tab`"
          >
            {{ system.actionLabel }}
            <span aria-hidden="true">↗</span>
          </a>
          <div v-else class="open-button open-button-disabled">
            Admin portal coming soon
            <span aria-hidden="true">—</span>
          </div>
        </article>
      </section>

      <p class="monitor-note">
        Availability only. No login credentials or private system data are stored by
        this dashboard.
      </p>

      <ManagementTrafficAnalytics />
    </main>
  </div>
</template>

<style scoped>
.management-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #03050a;
}

.management-grid {
  position: fixed;
  inset: 0;
  opacity: 0.48;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(to bottom, black, transparent 88%);
}

.management-glow {
  position: fixed;
  top: -360px;
  left: 50%;
  width: 1000px;
  height: 650px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    rgba(221, 168, 18, 0.15),
    rgba(96, 165, 250, 0.06) 42%,
    transparent 70%
  );
  filter: blur(50px);
  pointer-events: none;
}

.management-header {
  position: relative;
  z-index: 2;
  border-bottom: 1px solid var(--nex4-border);
  background: rgba(3, 5, 10, 0.72);
  backdrop-filter: blur(18px);
}

.header-inner {
  min-height: 78px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Manrope", sans-serif;
  font-size: 18px;
  font-weight: 800;
}

.brand img {
  width: 34px;
  height: 31px;
  object-fit: contain;
}

.area-label {
  color: var(--nex4-text-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.logout-button {
  min-height: 38px;
  padding: 0 15px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.045);
  color: var(--nex4-text-secondary);
  font-size: 12px;
  font-weight: 700;
  transition: 0.25s ease;
}

.logout-button:hover {
  border-color: var(--nex4-border-green);
  color: var(--nex4-text);
}

.management-main {
  position: relative;
  z-index: 1;
  padding-top: 88px;
  padding-bottom: 72px;
}

.overview {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 48px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 18px;
  color: var(--nex4-text-secondary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.8px;
  text-transform: uppercase;
}

.eyebrow span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--nex4-green);
  box-shadow: 0 0 14px rgba(221, 168, 18, 0.8);
}

h1 {
  font-family: "Manrope", sans-serif;
  font-size: clamp(46px, 6vw, 76px);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -4px;
}

.intro {
  max-width: 650px;
  margin-top: 22px;
  color: var(--nex4-text-secondary);
  font-size: 16px;
}

.refresh-button {
  min-width: 158px;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 18px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.045);
  color: var(--nex4-text);
  font-size: 13px;
  font-weight: 700;
  transition: 0.25s ease;
}

.refresh-button:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: var(--nex4-border-green);
  background: rgba(221, 168, 18, 0.08);
}

.refresh-button:disabled {
  cursor: wait;
  opacity: 0.72;
}

.spinning {
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

.summary {
  display: grid;
  grid-template-columns: 0.7fr 0.7fr 1.6fr;
  margin-top: 56px;
  border: 1px solid var(--nex4-border);
  border-radius: 18px;
  background: rgba(13, 18, 32, 0.62);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.035);
}

.summary > div {
  min-height: 112px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  padding: 24px 28px;
  border-right: 1px solid var(--nex4-border);
}

.summary > div:last-child {
  border-right: 0;
}

.summary span,
.metrics dt {
  color: var(--nex4-text-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.summary strong {
  font-family: "Manrope", sans-serif;
  font-size: 30px;
  font-weight: 600;
}

.summary .summary-time {
  font-family: "DM Sans", sans-serif;
  font-size: 16px;
}

.error-banner {
  margin-top: 24px;
  padding: 14px 18px;
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 12px;
  background: rgba(127, 29, 29, 0.16);
  color: #fca5a5;
  font-size: 14px;
}

.systems {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 22px;
}

.system-card {
  position: relative;
  padding: 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 20px;
  background:
    radial-gradient(circle at 100% 0, rgba(221, 168, 18, 0.07), transparent 34%),
    linear-gradient(145deg, rgba(18, 26, 43, 0.82), rgba(7, 10, 18, 0.88));
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22), inset 0 1px rgba(255, 255, 255, 0.045);
}

.card-heading {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
}

.system-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(221, 168, 18, 0.24);
  border-radius: 14px;
  background: rgba(221, 168, 18, 0.08);
  color: var(--nex4-green-bright);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.card-heading p {
  margin-bottom: 2px;
  color: var(--nex4-text-muted);
  font-size: 12px;
}

.card-heading h2 {
  font-family: "Manrope", sans-serif;
  font-size: 22px;
  line-height: 1.2;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border: 1px solid;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.status-badge i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-online {
  border-color: rgba(52, 211, 153, 0.24);
  background: rgba(16, 185, 129, 0.08);
  color: #6ee7b7;
}

.status-online i {
  background: #34d399;
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.65);
}

.status-offline {
  border-color: rgba(248, 113, 113, 0.24);
  background: rgba(239, 68, 68, 0.08);
  color: #fca5a5;
}

.status-offline i {
  background: #f87171;
  box-shadow: 0 0 10px rgba(248, 113, 113, 0.55);
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 28px 0;
  border-top: 1px solid var(--nex4-border);
  border-bottom: 1px solid var(--nex4-border);
}

.metrics > div {
  min-width: 0;
  padding: 20px 16px 20px 0;
}

.metrics dd {
  margin-top: 7px;
  overflow: hidden;
  color: var(--nex4-text);
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.open-button {
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  border-radius: 12px;
  background: var(--nex4-green);
  color: var(--nex4-navy);
  font-size: 13px;
  font-weight: 800;
  transition: 0.25s ease;
}

.open-button:hover {
  transform: translateY(-2px);
  background: var(--nex4-green-bright);
  box-shadow: 0 12px 30px rgba(221, 168, 18, 0.16);
}

.open-button-disabled {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.035);
  color: var(--nex4-text-muted);
  cursor: not-allowed;
}

.open-button-disabled:hover {
  transform: none;
  background: rgba(255, 255, 255, 0.035);
  box-shadow: none;
}

.monitor-note {
  margin-top: 24px;
  color: var(--nex4-text-muted);
  font-size: 12px;
  text-align: center;
}

@keyframes spin {
  to { transform: rotate(1turn); }
}

@media (max-width: 900px) {
  .systems { grid-template-columns: 1fr; }
  .overview { align-items: flex-start; flex-direction: column; gap: 28px; }
}

@media (max-width: 650px) {
  .area-label { display: none; }
  .management-main { padding-top: 62px; }
  h1 { font-size: 48px; letter-spacing: -3px; }
  .refresh-button { width: 100%; }
  .summary { grid-template-columns: 1fr 1fr; }
  .summary > div { min-height: 96px; padding: 20px; }
  .summary > div:nth-child(2) { border-right: 0; }
  .summary > div:last-child { grid-column: 1 / -1; border-top: 1px solid var(--nex4-border); }
  .system-card { padding: 21px; }
  .card-heading { grid-template-columns: auto 1fr; }
  .status-badge { grid-column: 1 / -1; width: max-content; }
  .metrics { grid-template-columns: 1fr; }
  .metrics > div { padding: 14px 0; border-bottom: 1px solid var(--nex4-border); }
  .metrics > div:last-child { border-bottom: 0; }
}
</style>
