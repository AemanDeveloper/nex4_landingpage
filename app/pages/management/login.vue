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
    <div class="login-grid" aria-hidden="true" />
    <section class="login-card" aria-labelledby="login-title">
      <NuxtLink to="/" class="brand" aria-label="Back to NEX4 home">
        <img src="/images/nex4-icon.png" alt="" />
        <span>NEX4</span>
      </NuxtLink>

      <div class="login-heading">
        <p><span /> Secure management access</p>
        <h1 id="login-title">Welcome back</h1>
        <div>Sign in to view and open NEX4 management systems.</div>
      </div>

      <form @submit.prevent="login">
        <label>
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

        <label>
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

        <button type="submit" :disabled="submitting || !session?.configured">
          {{ submitting ? "Signing in…" : "Sign in" }}
          <span aria-hidden="true">→</span>
        </button>
      </form>

      <p class="security-note">Protected by an encrypted, time-limited session.</p>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: 32px;
  background:
    radial-gradient(circle at 50% -10%, rgba(221, 168, 18, 0.14), transparent 38%),
    #03050a;
}

.login-grid {
  position: absolute;
  inset: 0;
  opacity: 0.45;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(circle, black, transparent 78%);
}

.login-card {
  position: relative;
  z-index: 1;
  width: min(100%, 460px);
  padding: 36px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(18, 26, 43, 0.92), rgba(7, 10, 18, 0.94));
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.45), inset 0 1px rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(24px);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: "Manrope", sans-serif;
  font-size: 18px;
  font-weight: 800;
}

.brand img { width: 34px; height: 31px; object-fit: contain; }
.login-heading { margin: 48px 0 30px; }
.login-heading > p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 13px;
  color: var(--nex4-text-secondary);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}
.login-heading > p span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--nex4-green);
  box-shadow: 0 0 12px rgba(221, 168, 18, 0.75);
}
.login-heading h1 {
  font-family: "Manrope", sans-serif;
  font-size: 38px;
  line-height: 1.1;
  letter-spacing: -2px;
}
.login-heading > div {
  margin-top: 12px;
  color: var(--nex4-text-secondary);
  font-size: 14px;
}
form { display: grid; gap: 18px; }
label {
  display: grid;
  gap: 8px;
  color: var(--nex4-text-secondary);
  font-size: 12px;
  font-weight: 700;
}
input {
  width: 100%;
  min-height: 50px;
  padding: 0 15px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  outline: none;
  background: rgba(3, 5, 10, 0.62);
  color: var(--nex4-text);
  transition: 0.2s ease;
}
input:focus { border-color: var(--nex4-green); box-shadow: 0 0 0 3px rgba(221, 168, 18, 0.1); }
form button {
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  background: var(--nex4-green);
  color: var(--nex4-navy);
  font-size: 13px;
  font-weight: 800;
}
form button:hover:not(:disabled) { background: var(--nex4-green-bright); }
form button:disabled { cursor: not-allowed; opacity: 0.55; }
.error-message { color: #fca5a5; font-size: 12px; }
.security-note {
  margin-top: 24px;
  color: var(--nex4-text-muted);
  font-size: 11px;
  text-align: center;
}

@media (max-width: 520px) {
  .login-page { padding: 16px; }
  .login-card { padding: 26px 22px; }
  .login-heading { margin-top: 38px; }
}
</style>
