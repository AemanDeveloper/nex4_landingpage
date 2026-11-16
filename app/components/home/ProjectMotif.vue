<script setup lang="ts">
import type { ProjectMotif } from "~/data/home";

defineProps<{ kind: ProjectMotif }>();
</script>

<template>
  <!-- A small looping animation that hints at what each product does. Colours come from the card's --p variables. -->
  <div class="motif" :class="`motif--${kind}`" aria-hidden="true">
    <template v-if="kind === 'nutrition'">
      <svg v-for="ring in 3" :key="ring" class="ring" :class="`ring--${ring}`" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="19" />
        <circle class="ring-fill" cx="24" cy="24" r="19" pathLength="100" />
      </svg>
      <svg class="leaf" viewBox="0 0 24 24">
        <path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 20 14 10" />
      </svg>
      <div class="pulse-line"><i /><i /><i /><i /><i /></div>
    </template>

    <template v-else-if="kind === 'pipeline'">
      <div class="stages">
        <span v-for="stage in 4" :key="stage" :style="{ '--s': stage - 1 }"><i /></span>
        <b class="deal" />
      </div>
    </template>

    <template v-else-if="kind === 'film'">
      <div class="reel">
        <div class="reel-track">
          <span v-for="frame in 10" :key="frame" :class="`cell--${(frame % 3) + 1}`" />
        </div>
      </div>
      <i class="spark" /><i class="spark spark--2" />
    </template>

    <template v-else>
      <div v-for="row in 3" :key="row" class="lesson" :style="{ '--r': row - 1 }">
        <span class="check"><svg viewBox="0 0 12 12"><path d="M2.5 6.2 5 8.6l4.5-5" /></svg></span>
        <span class="bar"><i /></span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.motif { position:relative; min-width:0; max-width:100%; height:58px; display:flex; align-items:center; gap:14px; margin-top:26px; }

/* NutriTrack: three macro rings filling, a leaf, and a row of bars like a daily log. */
.ring { width:46px; height:46px; flex:0 0 auto; transform:rotate(-90deg); }
.ring circle { fill:none; stroke:rgba(var(--p-rgb),.16); stroke-width:5; }
.ring .ring-fill { stroke:var(--p); stroke-linecap:round; stroke-dasharray:100; stroke-dashoffset:100; animation:ring-fill 4.5s var(--motion-ease) infinite alternate; }
.ring--1 .ring-fill { --to:22; }
.ring--2 .ring-fill { --to:45; stroke:var(--p-alt); animation-delay:.35s; }
.ring--3 .ring-fill { --to:64; animation-delay:.7s; opacity:.65; }
.leaf { width:26px; height:26px; flex:0 0 auto; fill:none; stroke:var(--p); stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; transform-origin:20% 90%; animation:leaf-sway 3.2s ease-in-out infinite; }
.pulse-line { height:34px; display:flex; align-items:flex-end; gap:5px; margin-left:4px; }
.pulse-line i { width:6px; height:100%; border-radius:3px; background:var(--p); transform-origin:bottom; animation:bar-bounce 1.6s ease-in-out infinite; animation-delay:calc(var(--n,0) * 1s); }
.pulse-line i:nth-child(1) { animation-delay:-.2s; opacity:.5; }
.pulse-line i:nth-child(2) { animation-delay:-.9s; }
.pulse-line i:nth-child(3) { animation-delay:-.5s; opacity:.7; }
.pulse-line i:nth-child(4) { animation-delay:-1.3s; }
.pulse-line i:nth-child(5) { animation-delay:-.7s; opacity:.5; }

/* CRM: a deal card travelling through four pipeline stages. */
.stages { position:relative; width:min(100%,330px); display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
.stages span { height:46px; display:flex; align-items:flex-end; padding:6px; border:1px solid rgba(var(--p-rgb),.22); border-radius:8px; background:rgba(var(--p-rgb),.05); animation:stage-glow 6s linear infinite; animation-delay:calc(var(--s) * 1.5s); }
.stages span i { width:60%; height:4px; border-radius:2px; background:rgba(var(--p-rgb),.3); }
.deal { position:absolute; top:7px; left:6px; width:calc(25% - 18px); height:16px; border-radius:4px; background:var(--p); box-shadow:0 6px 18px rgba(var(--p-rgb),.5); animation:deal-move 6s var(--motion-ease) infinite; }

/* Sebingkai: a film strip rolling past with a pair of flash sparks. */
.reel { width:min(100%,330px); overflow:hidden; border-radius:5px; background:#17110f; mask-image:linear-gradient(90deg,transparent,black 14%,black 86%,transparent); }
.reel-track { width:max-content; display:flex; gap:7px; padding:9px 7px; background-image:radial-gradient(circle,rgba(250,247,240,.75) 1.6px,transparent 2px),radial-gradient(circle,rgba(250,247,240,.75) 1.6px,transparent 2px); background-size:11px 6px,11px 6px; background-position:0 1px,0 calc(100% - 1px); background-repeat:repeat-x; animation:reel-roll 9s linear infinite; }
.reel-track span { width:48px; height:34px; border-radius:2px; background:linear-gradient(160deg,var(--p-alt),var(--p)); }
.reel-track .cell--2 { background:linear-gradient(160deg,#f2c94c,#9b7100); }
.reel-track .cell--3 { background:linear-gradient(160deg,#3a2f55,#121a2b); }
.spark { position:absolute; top:2px; left:min(86%,300px); width:14px; height:14px; background:var(--p-alt); clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%); animation:spark-pop 2.4s ease-in-out infinite; }
.spark--2 { top:36px; left:min(78%,270px); width:9px; height:9px; animation-delay:-1.2s; }

/* LMS: lessons completing one after another. */
.motif--lessons { height:auto; flex-direction:column; align-items:stretch; gap:7px; width:min(100%,300px); }
.lesson { display:flex; align-items:center; gap:10px; }
.check { width:15px; height:15px; flex:0 0 auto; display:grid; place-items:center; border-radius:50%; background:rgba(var(--p-rgb),.18); animation:check-pop 6s var(--motion-spring) infinite; animation-delay:calc(var(--r) * 1.1s); }
.check svg { width:9px; height:9px; fill:none; stroke:#06140f; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.bar { flex:1; height:6px; overflow:hidden; border-radius:99px; background:rgba(var(--p-rgb),.14); }
.bar i { display:block; height:100%; border-radius:inherit; background:linear-gradient(90deg,var(--p),var(--p-alt)); transform-origin:left; animation:lesson-fill 6s var(--motion-ease) infinite; animation-delay:calc(var(--r) * 1.1s); }

@keyframes ring-fill { to { stroke-dashoffset:var(--to); } }
@keyframes leaf-sway { 50% { transform:rotate(14deg); } }
@keyframes bar-bounce { 0%,100% { transform:scaleY(.3); } 50% { transform:scaleY(1); } }
@keyframes stage-glow { 0%,22% { border-color:rgba(var(--p-rgb),.75); background:rgba(var(--p-rgb),.14); } 26%,100% { border-color:rgba(var(--p-rgb),.22); background:rgba(var(--p-rgb),.05); } }
@keyframes deal-move { 0%,18% { transform:translateX(0); } 25%,43% { transform:translateX(calc(100% + 26px)); } 50%,68% { transform:translateX(calc(200% + 52px)); } 75%,93% { transform:translateX(calc(300% + 78px)); opacity:1; } 97% { transform:translateX(calc(300% + 78px)) scale(.6); opacity:0; } 100% { transform:translateX(0) scale(.6); opacity:0; } }
@keyframes reel-roll { to { transform:translateX(-165px); } }
@keyframes spark-pop { 0%,100% { transform:scale(0) rotate(0); opacity:0; } 50% { transform:scale(1) rotate(90deg); opacity:1; } }
@keyframes lesson-fill { 0% { transform:scaleX(0); } 30%,90% { transform:scaleX(1); } 100% { transform:scaleX(1); opacity:0; } }
@keyframes check-pop { 0%,26% { transform:scale(.6); background:rgba(var(--p-rgb),.18); } 32%,90% { transform:scale(1); background:var(--p-alt); } 100% { transform:scale(.6); background:rgba(var(--p-rgb),.18); } }

@media (prefers-reduced-motion:reduce) { .ring .ring-fill { stroke-dashoffset:var(--to); } }
</style>
