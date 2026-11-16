<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const rows = [
  ["Design", "Build", "Launch", "Grow"],
  ["Websites", "Mobile Apps", "AI Products", "Marketing"],
];

const band = ref<HTMLElement>();
let frame = 0;
let lastY = 0;
let skew = 0;

// The rows slide with the page and lean in the direction of the scroll, then settle.
const paint = () => {
  frame = 0;
  const element = band.value;
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const viewport = window.innerHeight;
  if (rect.bottom < -200 || rect.top > viewport + 200) return;

  const progress = (viewport - rect.top) / (viewport + rect.height);
  const velocity = window.scrollY - lastY;
  lastY = window.scrollY;
  skew += (Math.max(-9, Math.min(9, velocity * 0.25)) - skew) * 0.25;

  element.style.setProperty("--shift", `${(progress - 0.5) * 260}px`);
  element.style.setProperty("--skew", `${skew.toFixed(2)}deg`);
  if (Math.abs(skew) > 0.05) frame = requestAnimationFrame(paint);
};

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(paint);
};

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  lastY = window.scrollY;
  window.addEventListener("scroll", schedule, { passive: true });
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  window.removeEventListener("scroll", schedule);
});
</script>

<template>
  <div ref="band" class="kinetic-band" aria-hidden="true">
    <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="kinetic-row" :class="{ 'kinetic-row--reverse': rowIndex % 2 }">
      <div class="kinetic-track">
        <div v-for="copy in 3" :key="copy" class="kinetic-set">
          <template v-for="(word, wordIndex) in row" :key="word">
            <span :class="{ solid: (wordIndex + rowIndex) % 2 === 0 }">{{ word }}</span>
            <svg viewBox="0 0 40 40"><path d="M20 0c2 12 6 16 20 20-14 4-18 8-20 20-2-12-6-16-20-20C14 16 18 12 20 0Z" /></svg>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kinetic-band { --shift:0px; --skew:0deg; position:relative; display:grid; gap:10px; padding:54px 0; overflow:hidden; border-top:1px solid var(--nex4-border); background:#03050a; mask-image:linear-gradient(90deg,transparent,black 10%,black 90%,transparent); }
.kinetic-row { transform:translateX(var(--shift)) skewX(calc(var(--skew) * -1)); will-change:transform; }
.kinetic-row--reverse { transform:translateX(calc(var(--shift) * -1)) skewX(var(--skew)); }
.kinetic-track { display:flex; width:max-content; animation:kinetic-slide 38s linear infinite; }
.kinetic-row--reverse .kinetic-track { animation-direction:reverse; animation-duration:46s; }
.kinetic-set { display:flex; align-items:center; gap:34px; padding-right:34px; }
.kinetic-set span { color:transparent; font-family:"Manrope",sans-serif; font-size:clamp(54px,8.5vw,128px); font-weight:800; line-height:1; letter-spacing:-.05em; text-transform:uppercase; white-space:nowrap; -webkit-text-stroke:1px rgba(255,255,255,.22); transition:color .3s ease,-webkit-text-stroke-color .3s ease; }
.kinetic-set span.solid { -webkit-text-stroke:0; background:var(--nex4-gradient); background-clip:text; -webkit-background-clip:text; }
.kinetic-set svg { width:clamp(26px,3.4vw,46px); flex:0 0 auto; fill:var(--nex4-gold); animation:kinetic-star 7s linear infinite; }
@keyframes kinetic-slide { to { transform:translateX(-33.333%); } }
@keyframes kinetic-star { to { transform:rotate(1turn); } }
@media (max-width:700px) { .kinetic-band { padding:36px 0; gap:6px; } .kinetic-set { gap:20px; padding-right:20px; } }
@media (prefers-reduced-motion:reduce) { .kinetic-row,.kinetic-row--reverse { transform:none; } }
</style>
