<script setup lang="ts">
import { ref } from "vue";

const username = ref("");
const password = ref("");
const submitting = ref(false);
const errorMessage = ref("");

const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;
const { data: session } = await useFetch<{
  authenticated: boolean;
  configured: boolean;
}>("/api/management/session", { headers });

if (session.value?.authenticated) {
  await navigateTo("/management");
}

async function login() {
  errorMessage.value = "";
  submitting.value = true;

  try {
    await $fetch("/api/management/login", {
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
      },
    });
    await navigateTo("/management");
  } catch (error: unknown) {
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? Number(error.statusCode)
        : 0;

    if (statusCode === 429) {
      errorMessage.value = "Too many attempts. Please try again in 15 minutes.";
    } else if (!session.value?.configured) {
      errorMessage.value = "Management login has not been configured on this server.";
    } else if (statusCode === 503 || statusCode === 504) {
      errorMessage.value = "The management database is temporarily unavailable. Please try again.";
    } else {
      errorMessage.value = "Incorrect username or password.";
    }
  } finally {
    submitting.value = false;
  }
}

useSeoMeta({
  title: "Management Login — NEX4",
  description: "Secure access to the NEX4 management console.",
  robots: "noindex, nofollow",
});
</script>

<template>
  <main class="login-page">
    <div class="mgmt-grid" aria-hidden="true" />
    <div class="mgmt-glow" aria-hidden="true" />
    <div class="login-rings" aria-hidden="true"><i /><i /><i /></div>

    <section class="login-card" aria-labelledby="login-title">
      <div class="login-card-inner">
        <NuxtLink to="/" class="mgmt-brand mgmt-enter" aria-label="Back to NEX4 home">
          <img src="/images/nex4-icon.png" alt="" />
          <span>NEX4</span>
        </NuxtLink>

        <div class="login-heading">
          <p class="mgmt-enter" style="--i: 1"><span /> Secure management access</p>
          <h1 id="login-title" class="mgmt-enter" style="--i: 2">Welcome <em>back</em></h1>
          <div class="mgmt-enter" style="--i: 3">Sign in to view and open NEX4 management systems.</div>
        </div>

        <form @submit.prevent="login">
          <label class="mgmt-enter" style="--i: 4">
            Username
            <input
              v-model="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              autofocus
            />
          </label>

          <label class="mgmt-enter" style="--i: 5">
            Password
            <input
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
            />
          </label>

          <p v-if="errorMessage" class="error-message" role="alert">
            {{ errorMessage }}
          </p>

          <button class="mgmt-enter" style="--i: 6" type="submit" :disabled="submitting || !session?.configured">
            {{ submitting ? "Signing in…" : "Sign in" }}
            <span aria-hidden="true" :class="{ working: submitting }">→</span>
          </button>
        </form>

        <p class="security-note mgmt-enter" style="--i: 7">
          <i aria-hidden="true" /> Protected by an encrypted, time-limited session.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-page { position: relative; min-height: 100vh; display: grid; place-items: center; overflow: hidden; padding: 32px; background: #03050a; }

/* Slow ripples spreading out from behind the card. */
.login-rings { position: absolute; top: 50%; left: 50%; width: min(1200px,190vw); aspect-ratio: 1; transform: translate(-50%,-50%); pointer-events: none; mask-image: radial-gradient(circle,black 30%,transparent 70%); }
.login-rings i { position: absolute; inset: 0; border: 1px solid rgba(221,168,18,.2); border-radius: 50%; opacity: 0; animation: login-ripple 10s linear infinite; }
.login-rings i:nth-child(2) { animation-delay: -3.3s; }
.login-rings i:nth-child(3) { animation-delay: -6.6s; }

/* The card border is a light that travels around the edge. */
.login-card { position: relative; z-index: 1; width: min(100%,460px); padding: 1px; overflow: hidden; border-radius: 25px; background: rgba(255,255,255,.1); box-shadow: 0 30px 90px rgba(0,0,0,.5); animation: mgmt-enter .9s var(--motion-ease) backwards; }
.login-card::before { content: ""; position: absolute; inset: -60%; background: conic-gradient(from 0deg,transparent 0 72%,rgba(221,168,18,.15) 80%,#dda812 90%,#fff1b8 94%,transparent 100%); animation: mgmt-spin 5s linear infinite; }
.login-card-inner { position: relative; padding: 36px; border-radius: 24px; background: linear-gradient(145deg,#121a2b,#070a12); box-shadow: inset 0 1px rgba(255,255,255,.06); }

.login-heading { margin: 44px 0 30px; }
.login-heading > p { display: flex; align-items: center; gap: 8px; margin-bottom: 13px; color: var(--nex4-text-secondary); font-size: 11px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; }
.login-heading > p span { width: 6px; height: 6px; border-radius: 50%; background: var(--nex4-green); box-shadow: 0 0 12px rgba(221,168,18,.75); animation: status-pulse 2.2s ease-in-out infinite; }
.login-heading h1 { font-family: "Manrope",sans-serif; font-size: 40px; font-weight: 600; line-height: 1.1; letter-spacing: -2px; }
.login-heading h1 em { font-style: normal; color: transparent; background: var(--nex4-gradient); background-clip: text; -webkit-background-clip: text; }
.login-heading > div { margin-top: 12px; color: var(--nex4-text-secondary); font-size: 14px; }

form { display: grid; gap: 18px; }
label { display: grid; gap: 8px; color: var(--nex4-text-secondary); font-size: 13px; font-weight: 700; transition: color .2s ease; }
label:focus-within { color: var(--nex4-gold); }
input { width: 100%; min-height: 52px; padding: 0 15px; border: 1px solid rgba(255,255,255,.12); border-radius: 12px; outline: none; background: rgba(3,5,10,.62); color: var(--nex4-text); font-size: 15px; transition: border-color .2s ease,box-shadow .2s ease,background .2s ease; }
input:hover { border-color: rgba(255,255,255,.22); }
input:focus { border-color: var(--nex4-green); background: rgba(3,5,10,.9); box-shadow: 0 0 0 4px rgba(221,168,18,.12); }
form button { min-height: 52px; display: flex; align-items: center; justify-content: space-between; margin-top: 3px; padding: 0 18px; border: 0; border-radius: 12px; background: var(--nex4-green); color: var(--nex4-navy); font-size: 14px; font-weight: 800; transition: background .25s ease,box-shadow .25s ease,translate .25s var(--motion-ease); }
form button span { transition: transform var(--motion-fast) var(--motion-ease); }
form button:hover:not(:disabled) { translate: 0 -2px; background: var(--nex4-green-bright); box-shadow: 0 14px 34px rgba(221,168,18,.24); }
form button:hover:not(:disabled) span { transform: translateX(5px); }
form button span.working { animation: login-nudge .7s ease-in-out infinite alternate; }
form button:disabled { cursor: not-allowed; opacity: .55; }
.error-message { padding: 10px 13px; border: 1px solid rgba(248,113,113,.28); border-radius: 10px; background: rgba(127,29,29,.16); color: #fca5a5; font-size: 13px; animation: login-shake .4s ease; }
.security-note { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 24px; color: var(--nex4-text-muted); font-size: 12px; }
.security-note i { width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 8px #34d399; }

@keyframes login-ripple { from { opacity: .9; transform: scale(.2); } to { opacity: 0; transform: scale(1); } }
@keyframes login-nudge { to { transform: translateX(6px); } }
@keyframes login-shake { 25% { transform: translateX(-6px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-3px); } }

@media (max-width: 520px) {
  .login-page { padding: 16px; }
  .login-card-inner { padding: 26px 22px; }
  .login-heading { margin-top: 36px; }
}
</style>
