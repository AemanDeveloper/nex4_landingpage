<script setup lang="ts">
import ArrowUpRightIcon from "~/components/ui/ArrowUpRightIcon.vue";

defineProps<{
  href: string;
  label: string;
}>();
</script>

<template>
  <a :href="href" class="noise-button">
    <span class="noise-button-surface">
      <span>{{ label }}</span>
      <ArrowUpRightIcon />
    </span>
  </a>
</template>

<style scoped>
.noise-button {
  position: relative;
  isolation: isolate;
  min-height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 4px;
  border: 0;
  border-radius: 999px;
  background:
    radial-gradient(circle at 10% 20%, rgb(241, 118, 86), transparent 38%),
    radial-gradient(circle at 88% 18%, rgb(100, 150, 255), transparent 42%),
    radial-gradient(circle at 50% 120%, rgb(242, 201, 76), transparent 55%),
    #171717;
  box-shadow: 0 14px 44px rgba(221, 168, 18, 0.16);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  transition: box-shadow var(--motion-fast) var(--motion-ease);
}

.noise-button::before {
  content: "";
  position: absolute;
  z-index: 0;
  inset: -80%;
  opacity: 0.28;
  background-image:
    repeating-radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0 0.7px, transparent 0.8px 3px);
  background-size: 5px 5px;
  animation: noise-shift 0.28s steps(2) infinite;
}

.noise-button::after {
  content: "";
  position: absolute;
  z-index: 0;
  inset: -45%;
  background: conic-gradient(from 0deg, #dda812, #fff1b8, rgb(100,150,255), #f17656, #dda812);
  filter: blur(16px);
  opacity: 0.55;
  animation: gradient-orbit 7s linear infinite;
}

.noise-button-surface {
  position: relative;
  z-index: 1;
  min-height: 50px;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 25px;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: inherit;
  background: linear-gradient(90deg,#050505,#050505,#171717);
  box-shadow: inset 0 1px 0 #030303, 0 1px 0 rgba(255,255,255,.08);
}

.noise-button:hover {
  box-shadow: 0 20px 55px rgba(221, 168, 18, 0.26);
}

.noise-button :deep(svg) { transition: transform var(--motion-fast) var(--motion-ease); }
.noise-button:hover :deep(svg) { transform: translate(2px, -2px); }

@keyframes noise-shift {
  0% { transform: translate3d(-1%, 1%, 0); }
  50% { transform: translate3d(1%, -1%, 0); }
  100% { transform: translate3d(0, 1%, 0); }
}

@keyframes gradient-orbit { to { transform: rotate(1turn); } }
</style>
