<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

definePageMeta({
  middleware: "management-auth",
});

type SystemStatus = {
  id: "lms-owner" | "crm" | "nutritrack" | "lensa";
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

const { data, error, status, refresh } = useFetch<StatusResponse>(
  "/api/management/status",
  {
    cache: "no-store",
    lazy: true,
    server: false,
  },
);

const systems = computed(() => data.value?.systems ?? []);
const onlineCount = computed(
  () => systems.value.filter((system) => system.online).length,
);
const isRefreshing = computed(() => status.value === "pending");
// Placeholders only appear after mount, so the server and client render the same markup first.
const mounted = ref(false);
const isFirstLoad = computed(
  () => mounted.value && isRefreshing.value && !systems.value.length,
);

const ringCircumference = 2 * Math.PI * 52;
const healthRatio = computed(() =>
  systems.value.length ? onlineCount.value / systems.value.length : 0,
);
const allOnline = computed(
  () => systems.value.length > 0 && onlineCount.value === systems.value.length,
);
const healthLabel = computed(() => {
  if (!systems.value.length) return "Checking systems…";
  if (allOnline.value) return "All systems operational";
  const offline = systems.value.length - onlineCount.value;
  return `${offline} ${offline === 1 ? "system needs" : "systems need"} attention`;
});
const averageResponse = computed(() => {
  const times = systems.value
    .map((system) => system.responseTimeMs)
    .filter((time): time is number => time !== null);
  if (!times.length) return null;
  return Math.round(times.reduce((total, time) => total + time, 0) / times.length);
});

// Response time shown as a meter: the bar fills towards a 2 second ceiling.
function speed(responseTimeMs: number | null) {
  if (responseTimeMs === null) return { width: "0%", tone: "none", label: "No response" };
  const width = `${Math.max(4, Math.min(100, (responseTimeMs / 2000) * 100))}%`;
  if (responseTimeMs < 600) return { width, tone: "fast", label: "Fast" };
  if (responseTimeMs < 1500) return { width, tone: "steady", label: "Steady" };
  return { width, tone: "slow", label: "Slow" };
}

usePointerSpotlight();

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
    lensa: "SBK",
  }[id];
}

async function logout() {
  await $fetch("/api/management/logout", { method: "POST" });
  await navigateTo("/management/login");
}

let refreshTimer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  mounted.value = true;
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
  <div class="mgmt-page">
    <div class="mgmt-grid" aria-hidden="true" />
    <div class="mgmt-glow" aria-hidden="true" />

    <header class="mgmt-topbar">
      <div class="container mgmt-topbar-inner">
        <NuxtLink to="/" class="mgmt-brand" aria-label="Back to NEX4 home">
          <img src="/images/nex4-icon.png" alt="" />
          <span>NEX4</span>
        </NuxtLink>

        <div class="header-actions">
          <span class="area-label">System Management</span>
          <button class="mgmt-pill-button" type="button" @click="logout">
            Log out
          </button>
        </div>
      </div>
    </header>

    <main class="container management-main">
      <section class="overview" aria-labelledby="management-title">
        <div>
          <p class="eyebrow mgmt-enter"><span /> Management Console</p>
          <h1 id="management-title" class="mgmt-enter" style="--i: 1">
            Systems <span>overview</span>
          </h1>
          <p class="intro mgmt-enter" style="--i: 2">
            Live availability checks for NEX4 management platforms. Checks run
            securely from the NEX4 server and refresh automatically every
            minute.
          </p>
        </div>

        <button
          class="mgmt-pill-button refresh-button mgmt-enter"
          style="--i: 3"
          type="button"
          :disabled="isRefreshing"
          @click="refresh()"
        >
          <span class="refresh-icon" :class="{ spinning: isRefreshing }">↻</span>
          {{ isRefreshing ? "Checking…" : "Refresh status" }}
        </button>
      </section>

      <section
        class="summary mgmt-enter"
        :class="{ 'summary--alert': systems.length && !allOnline }"
        style="--i: 4"
        aria-label="System summary"
      >
        <div class="health">
          <div class="health-ring" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <circle class="ring-track" cx="60" cy="60" r="52" />
              <circle
                class="ring-value"
                cx="60"
                cy="60"
                r="52"
                :stroke-dasharray="ringCircumference"
                :stroke-dashoffset="ringCircumference * (1 - healthRatio)"
              />
            </svg>
            <div class="ring-count">
              <strong>{{ onlineCount }}</strong><span>/{{ systems.length }}</span>
            </div>
          </div>
          <div class="health-copy">
            <span>Network health</span>
            <strong>{{ healthLabel }}</strong>
            <p>{{ onlineCount }} of {{ systems.length }} systems online</p>
          </div>
        </div>

        <div class="summary-tile">
          <span>Average response</span>
          <strong>{{ averageResponse === null ? "—" : `${averageResponse} ms` }}</strong>
        </div>
        <div class="summary-tile">
          <span>Last refresh</span>
          <strong class="summary-time">
            {{
              data?.checkedAt ? formatCheckedAt(data.checkedAt) : "Checking…"
            }}
          </strong>
        </div>
      </section>

      <div v-if="error" class="error-banner" role="alert">
        Status data is temporarily unavailable. Please try refreshing the
        dashboard.
      </div>

      <section v-if="isFirstLoad" class="systems" aria-hidden="true">
        <div v-for="placeholder in 4" :key="placeholder" class="mgmt-skeleton system-skeleton" />
      </section>

      <section v-else class="systems" aria-label="Managed systems">
        <article
          v-for="(system, index) in systems"
          :key="system.id"
          class="system-card mgmt-card mgmt-enter"
          :class="{ 'system-card--offline': !system.online }"
          :style="{ '--i': index }"
          data-spotlight
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

          <div class="speed" :class="`speed--${speed(system.responseTimeMs).tone}`">
            <div class="speed-track" aria-hidden="true">
              <i class="mgmt-bar mgmt-bar--x" :style="{ width: speed(system.responseTimeMs).width, '--i': index * 3 }" />
            </div>
            <span>{{ speed(system.responseTimeMs).label }}</span>
          </div>

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
        Availability only. No login credentials or private system data are
        stored by this dashboard.
      </p>

      <ManagementTrafficAnalytics />
    </main>
  </div>
</template>

<style scoped>
.header-actions { display: flex; align-items: center; gap: 18px; }
.area-label { color: var(--nex4-text-secondary); font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }

.management-main { position: relative; z-index: 1; padding-top: 76px; padding-bottom: 72px; }
.overview { display: flex; align-items: flex-end; justify-content: space-between; gap: 48px; }
.eyebrow { display: flex; align-items: center; gap: 9px; margin-bottom: 18px; color: var(--nex4-text-secondary); font-size: 12px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; }
.eyebrow span { width: 7px; height: 7px; border-radius: 50%; background: var(--nex4-green); box-shadow: 0 0 14px rgba(221,168,18,.8); animation: status-pulse 2.2s ease-in-out infinite; }
h1 { font-family: "Manrope",sans-serif; font-size: clamp(46px,6vw,76px); font-weight: 600; line-height: 1; letter-spacing: -4px; }
h1 span { color: transparent; background: var(--nex4-gradient); background-clip: text; -webkit-background-clip: text; }
.intro { max-width: 650px; margin-top: 22px; color: var(--nex4-text-secondary); font-size: 16px; }
.refresh-button { min-width: 168px; min-height: 48px; justify-content: center; color: var(--nex4-text); }
.refresh-icon { display: inline-block; font-size: 16px; transition: transform var(--motion-medium) var(--motion-ease); }
.refresh-button:hover:not(:disabled) .refresh-icon { transform: rotate(180deg); }
.refresh-icon.spinning { animation: mgmt-spin .8s linear infinite; }

/* Health summary: a ring that fills with the share of systems online. */
.summary { --health: #34d399; display: grid; grid-template-columns: 1.5fr .8fr 1fr; margin-top: 56px; overflow: hidden; border: 1px solid var(--nex4-border); border-radius: 22px; background: radial-gradient(circle at 0 0,color-mix(in srgb,var(--health) 12%,transparent),transparent 45%),rgba(13,18,32,.66); box-shadow: inset 0 1px rgba(255,255,255,.045); }
.summary--alert { --health: #f87171; }
.health { display: flex; align-items: center; gap: 24px; padding: 26px 28px; border-right: 1px solid var(--nex4-border); }
.health-ring { position: relative; width: 104px; flex: 0 0 auto; aspect-ratio: 1; }
.health-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.health-ring circle { fill: none; stroke-width: 9; }
.ring-track { stroke: rgba(255,255,255,.07); }
.ring-value { stroke: var(--health); stroke-linecap: round; filter: drop-shadow(0 0 7px var(--health)); transition: stroke-dashoffset 1.2s var(--motion-ease),stroke .4s ease; }
.ring-count { position: absolute; inset: 0; display: flex; align-items: baseline; justify-content: center; padding-top: 34px; font-family: "Manrope",sans-serif; }
.ring-count strong { font-size: 30px; font-weight: 700; line-height: 1; }
.ring-count span { color: var(--nex4-text-muted); font-size: 14px; }
.health-copy span,.summary-tile span,.metrics dt { color: var(--nex4-text-muted); font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.health-copy strong { display: block; margin-top: 5px; font-family: "Manrope",sans-serif; font-size: clamp(20px,2vw,26px); font-weight: 600; line-height: 1.2; letter-spacing: -.6px; }
.health-copy p { margin-top: 5px; color: var(--nex4-text-secondary); font-size: 13px; }
.summary-tile { display: flex; flex-direction: column; justify-content: center; gap: 6px; padding: 24px 28px; border-right: 1px solid var(--nex4-border); }
.summary-tile:last-child { border-right: 0; }
.summary-tile strong { font-family: "Manrope",sans-serif; font-size: 28px; font-weight: 600; font-variant-numeric: tabular-nums; }
.summary-tile .summary-time { font-family: "DM Sans",sans-serif; font-size: 16px; }

.error-banner { margin-top: 24px; padding: 14px 18px; border: 1px solid rgba(248,113,113,.3); border-radius: 12px; background: rgba(127,29,29,.16); color: #fca5a5; font-size: 14px; }

.systems { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 20px; margin-top: 22px; }
.system-skeleton { height: 290px; }
.system-card { padding: 28px; overflow: hidden; }
.system-card::after { content: ""; position: absolute; z-index: 1; inset: 0 18% auto; height: 1px; background: linear-gradient(90deg,transparent,rgba(52,211,153,.7),transparent); }
.system-card--offline { border-color: rgba(248,113,113,.28); }
.system-card--offline::after { background: linear-gradient(90deg,transparent,rgba(248,113,113,.8),transparent); }
.card-heading { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px; }
.system-icon { width: 52px; height: 52px; display: grid; place-items: center; border: 1px solid rgba(221,168,18,.24); border-radius: 14px; background: rgba(221,168,18,.08); color: var(--nex4-green-bright); font-size: 11px; font-weight: 800; letter-spacing: .8px; transition: transform var(--motion-medium) var(--motion-spring),background .3s ease; }
.system-card:hover .system-icon { transform: rotate(-6deg) scale(1.08); background: rgba(221,168,18,.16); }
.card-heading p { margin-bottom: 2px; color: var(--nex4-text-muted); font-size: 12px; }
.card-heading h2 { font-family: "Manrope",sans-serif; font-size: 22px; line-height: 1.2; }

.status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 7px 11px; border: 1px solid; border-radius: 999px; font-size: 12px; font-weight: 700; }
.status-badge i { position: relative; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.status-online { border-color: rgba(52,211,153,.24); background: rgba(16,185,129,.08); color: #6ee7b7; }
/* A live system sends out a slow radar ping. */
.status-online i::after { content: ""; position: absolute; inset: 0; border-radius: 50%; background: currentColor; animation: mgmt-ping 2s ease-out infinite; }
.status-offline { border-color: rgba(248,113,113,.24); background: rgba(239,68,68,.08); color: #fca5a5; }

.metrics { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); margin: 28px 0 0; border-top: 1px solid var(--nex4-border); }
.metrics > div { min-width: 0; padding: 20px 16px 16px 0; }
.metrics dd { margin-top: 7px; overflow: hidden; color: var(--nex4-text); font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; text-overflow: ellipsis; white-space: nowrap; }

.speed { --speed: #34d399; display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
.speed--steady { --speed: var(--nex4-gold); }
.speed--slow { --speed: #f87171; }
.speed--none { --speed: #6b7280; }
.speed-track { flex: 1; height: 5px; overflow: hidden; border-radius: 999px; background: rgba(255,255,255,.06); }
.speed-track i { display: block; height: 100%; border-radius: inherit; background: var(--speed); box-shadow: 0 0 10px var(--speed); }
.speed span { min-width: 78px; color: var(--speed); font-size: 12px; font-weight: 700; text-align: right; }

.open-button { min-height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 0 18px; border-radius: 12px; background: var(--nex4-green); color: var(--nex4-navy); font-size: 14px; font-weight: 800; transition: background .25s ease,box-shadow .25s ease; }
.open-button span { transition: transform var(--motion-fast) var(--motion-ease); }
.open-button:hover { background: var(--nex4-green-bright); box-shadow: 0 12px 30px rgba(221,168,18,.2); }
.open-button:hover span { transform: translate(3px,-3px); }
.open-button-disabled { border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.035); color: var(--nex4-text-muted); cursor: not-allowed; }
.open-button-disabled:hover { background: rgba(255,255,255,.035); box-shadow: none; }
.open-button-disabled:hover span { transform: none; }

.monitor-note { margin-top: 24px; color: var(--nex4-text-muted); font-size: 12px; text-align: center; }

@media (max-width: 1000px) {
  .summary { grid-template-columns: 1fr 1fr; }
  .health { grid-column: 1 / -1; border-right: 0; border-bottom: 1px solid var(--nex4-border); }
}
@media (max-width: 900px) {
  .systems { grid-template-columns: 1fr; }
  .overview { align-items: flex-start; flex-direction: column; gap: 28px; }
}
@media (max-width: 650px) {
  .area-label { display: none; }
  .management-main { padding-top: 54px; }
  h1 { font-size: 48px; letter-spacing: -3px; }
  .refresh-button { width: 100%; }
  .health { gap: 18px; padding: 22px 20px; }
  .health-ring { width: 84px; }
  .ring-count { padding-top: 27px; }
  .ring-count strong { font-size: 24px; }
  .summary-tile { padding: 20px; }
  .summary-tile strong { font-size: 22px; }
  .summary-tile .summary-time { font-size: 13px; }
  .system-card { padding: 21px; }
  .card-heading { grid-template-columns: auto 1fr; }
  .status-badge { grid-column: 1 / -1; width: max-content; }
  .metrics { grid-template-columns: 1fr; }
  .metrics > div { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 13px 0; border-bottom: 1px solid var(--nex4-border); }
  .metrics dd { margin-top: 0; }
  .speed { margin-top: 18px; }
}
</style>
