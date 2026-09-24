<script setup lang="ts">
import ArrowUpRightIcon from "~/components/ui/ArrowUpRightIcon.vue";

defineProps<{
  href: string;
  label: string;
}>();
</script>

<template>
  <a :href="href" class="noise-button">
    <span>{{ label }}</span>
    <ArrowUpRightIcon />
  </a>
</template>

<style scoped>
.noise-button {
  position: relative;
  isolation: isolate;
  min-height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  overflow: hidden;
  padding: 0 25px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  background:
    radial-gradient(circle at 15% 20%, rgb(255, 100, 150), transparent 42%),
    radial-gradient(circle at 84% 18%, rgb(100, 150, 255), transparent 43%),
    radial-gradient(circle at 50% 115%, rgb(255, 200, 100), transparent 54%),
    #7b62d5;
  box-shadow: 0 14px 45px rgba(100, 150, 255, 0.22), inset 0 1px rgba(255, 255, 255, 0.42);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  transition: transform var(--motion-fast) var(--motion-ease), box-shadow var(--motion-fast) var(--motion-ease);
}

.noise-button::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: -80%;
  opacity: 0.22;
  background-image:
    repeating-radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0 0.7px, transparent 0.8px 3px);
  background-size: 5px 5px;
  animation: noise-shift 0.28s steps(2) infinite;
}

.noise-button::after {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 1px;
  border-radius: inherit;
  background: linear-gradient(105deg, transparent 25%, rgba(255, 255, 255, 0.28) 48%, transparent 70%);
  transform: translateX(-120%);
  transition: transform 0.75s var(--motion-ease);
}

.noise-button:hover {
  transform: translateY(-3px) scale(1.015);
  box-shadow: 0 20px 55px rgba(100, 150, 255, 0.3), inset 0 1px rgba(255, 255, 255, 0.5);
}

.noise-button:hover::after { transform: translateX(120%); }
.noise-button :deep(svg) { transition: transform var(--motion-fast) var(--motion-ease); }
.noise-button:hover :deep(svg) { transform: translate(2px, -2px); }

@keyframes noise-shift {
  0% { transform: translate3d(-1%, 1%, 0); }
  50% { transform: translate3d(1%, -1%, 0); }
  100% { transform: translate3d(0, 1%, 0); }
}
</style>
