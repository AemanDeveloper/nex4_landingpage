<script setup lang="ts">
import { services } from "~/data/home";

const scenes = ["web", "mobile", "marketing"] as const;
</script>

<template>
  <!-- Three looping motion-graphic scenes, one per service. Purely decorative: the details live in the terminal below. -->
  <div class="scenes">
    <figure
      v-for="(service, index) in services"
      :key="service.title"
      class="scene"
      :class="`scene--${scenes[index]}`"
      data-reveal="scale"
      data-spotlight
      :style="{ '--reveal-delay': `${index * 130}ms` }"
    >
      <div class="stage" aria-hidden="true">
        <!-- Web: a page assembles itself and the cursor clicks the button. -->
        <template v-if="scenes[index] === 'web'">
          <div class="browser">
            <div class="browser-bar"><i /><i /><i /><span /></div>
            <div class="browser-body">
              <div class="block block--nav" />
              <div class="block block--title" />
              <div class="block block--text" />
              <div class="block block--button" />
              <div class="block block--card" /><div class="block block--card block--card-2" /><div class="block block--card block--card-3" />
            </div>
          </div>
          <svg class="cursor" viewBox="0 0 24 24"><path d="M5 3l14 8-6 2-2 6z" /></svg>
          <span class="tag tag--a">&lt;/&gt;</span>
          <span class="tag tag--b">{ }</span>
        </template>

        <!-- Mobile: screens swipe past inside a phone while a notification drops in. -->
        <template v-else-if="scenes[index] === 'mobile'">
          <div class="phone">
            <div class="phone-notch" />
            <div class="phone-screens">
              <div class="screen screen--1"><i /><i /><i /></div>
              <div class="screen screen--2"><b /><i /><i /></div>
              <div class="screen screen--3"><em /><em /><em /><em /></div>
            </div>
            <div class="phone-toast"><i /><span /></div>
          </div>
          <div class="ripple" />
          <span class="chip chip--a" /><span class="chip chip--b" />
        </template>

        <!-- Marketing: a growth line draws itself, bars rise and reactions float up. -->
        <template v-else>
          <svg class="chart" viewBox="0 0 220 130" preserveAspectRatio="none">
            <defs>
              <linearGradient id="scene-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#dda812" stop-opacity=".45" />
                <stop offset="1" stop-color="#dda812" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path class="chart-grid" d="M0 32H220M0 65H220M0 98H220" />
            <path class="chart-area" d="M0 112 C30 104 42 92 66 90 S104 96 124 70 164 54 182 34 208 22 220 14 V130 H0Z" fill="url(#scene-area)" />
            <path class="chart-line" pathLength="1" d="M0 112 C30 104 42 92 66 90 S104 96 124 70 164 54 182 34 208 22 220 14" />
          </svg>
          <div class="chart-dot" />
          <div class="bars"><i /><i /><i /><i /><i /></div>
          <span class="react react--1">♥</span><span class="react react--2">♥</span><span class="react react--3">★</span>
        </template>
      </div>

      <figcaption>
        <span>{{ service.number }}</span>
        <strong>{{ service.title }}</strong>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.scenes { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; margin-bottom:22px; }
.scene { overflow:hidden; border:1px solid rgba(255,255,255,.09); border-radius:18px; background:linear-gradient(160deg,#0f1420,#070a11); transition:opacity var(--motion-medium) var(--motion-ease),transform var(--motion-slow) var(--motion-ease),filter var(--motion-medium) var(--motion-ease),border-color .3s ease; transition-delay:var(--reveal-delay,0ms); }
.scene:hover { border-color:var(--nex4-border-green); }
.stage { position:relative; z-index:1; height:230px; overflow:hidden; background:radial-gradient(circle at 50% 110%,rgba(221,168,18,.16),transparent 60%),linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px); background-size:auto,26px 26px,26px 26px; }
figcaption { position:relative; z-index:1; display:flex; align-items:center; gap:14px; padding:16px 20px; border-top:1px solid rgba(255,255,255,.07); }
figcaption span { color:var(--nex4-gold); font-size:12px; font-weight:700; letter-spacing:1px; }
figcaption strong { font-family:"Manrope",sans-serif; font-size:16px; letter-spacing:-.3px; }

/* ---------- Web ---------- */
.browser { position:absolute; top:28px; left:50%; width:230px; margin-left:-115px; overflow:hidden; border:1px solid rgba(255,255,255,.16); border-radius:10px; background:#0b0f19; box-shadow:0 24px 50px rgba(0,0,0,.5); animation:float-y 6s ease-in-out infinite; }
.browser-bar { height:22px; display:flex; align-items:center; gap:5px; padding:0 9px; border-bottom:1px solid rgba(255,255,255,.08); background:#141a27; }
.browser-bar i { width:6px; height:6px; border-radius:50%; background:#ff5f57; }
.browser-bar i:nth-child(2) { background:#febc2e; }
.browser-bar i:nth-child(3) { background:#28c840; }
.browser-bar span { flex:1; height:8px; margin-left:8px; border-radius:99px; background:rgba(255,255,255,.07); }
.browser-body { height:140px; display:grid; grid-template-columns:repeat(3,1fr); grid-auto-rows:min-content; gap:8px; padding:12px; }
.block { border-radius:4px; background:rgba(255,255,255,.12); animation:block-in 7s var(--motion-ease) infinite; }
.block--nav { grid-column:1/-1; height:6px; width:45%; animation-delay:.1s; }
.block--title { grid-column:1/-1; height:15px; width:82%; background:rgba(250,247,240,.85); animation-delay:.5s; }
.block--text { grid-column:1/-1; height:6px; width:60%; animation-delay:.9s; }
.block--button { grid-column:1/-1; height:17px; width:62px; border-radius:99px; background:var(--nex4-gold); animation-name:block-in,button-press; animation-duration:7s,7s; animation-delay:1.3s,0s; }
.block--card { height:38px; animation-delay:1.7s; }
.block--card-2 { animation-delay:1.9s; }
.block--card-3 { animation-delay:2.1s; }
.cursor { position:absolute; top:0; left:50%; width:22px; height:22px; fill:#fff; stroke:#05070d; stroke-width:1.2; filter:drop-shadow(0 4px 8px rgba(0,0,0,.5)); animation:cursor-path 7s var(--motion-ease) infinite; }
.tag { position:absolute; padding:4px 8px; border:1px solid rgba(221,168,18,.35); border-radius:7px; background:rgba(5,7,13,.8); color:var(--nex4-gold); font-family:ui-monospace,Menlo,monospace; font-size:11px; animation:float-y 5s ease-in-out infinite; }
.tag--a { top:22px; right:8%; animation-delay:-1.5s; }
.tag--b { bottom:22px; left:7%; animation-delay:-3s; }

/* ---------- Mobile ---------- */
.phone { position:absolute; top:22px; left:50%; width:104px; height:200px; margin-left:-52px; overflow:hidden; border:2px solid rgba(255,255,255,.22); border-radius:20px; background:#0b0f19; box-shadow:0 24px 50px rgba(0,0,0,.5); animation:phone-tilt 7s ease-in-out infinite; }
.phone-notch { position:absolute; z-index:3; top:6px; left:50%; width:34px; height:7px; margin-left:-17px; border-radius:99px; background:#05070d; }
.phone-screens { display:flex; width:300%; height:100%; animation:screens-swipe 9s var(--motion-ease) infinite; }
.screen { flex:1; display:flex; flex-direction:column; gap:7px; padding:24px 10px 10px; }
.screen i { height:26px; border-radius:7px; background:rgba(255,255,255,.1); }
.screen--1 i:first-child { height:54px; background:linear-gradient(140deg,#f2c94c,#9b7100); }
.screen b { height:70px; border-radius:50%; aspect-ratio:1; align-self:center; background:conic-gradient(var(--nex4-gold) 68%,rgba(255,255,255,.1) 0); mask-image:radial-gradient(circle,transparent 52%,black 54%); animation:mgmt-spin 6s linear infinite; }
.screen--3 { flex-direction:row; flex-wrap:wrap; align-content:flex-start; }
.screen em { width:calc(50% - 4px); height:38px; border-radius:8px; background:rgba(255,255,255,.1); }
.screen em:nth-child(2) { background:rgba(221,168,18,.6); }
.screen em:nth-child(3) { background:rgba(96,165,250,.45); }
.phone-toast { position:absolute; z-index:2; top:18px; left:7px; right:7px; display:flex; align-items:center; gap:6px; padding:6px; border-radius:9px; background:rgba(250,247,240,.95); animation:toast-drop 9s var(--motion-spring) infinite; }
.phone-toast i { width:12px; height:12px; border-radius:4px; background:var(--nex4-gold); }
.phone-toast span { flex:1; height:5px; border-radius:99px; background:#9aa0ab; }
.ripple { position:absolute; top:150px; left:50%; width:26px; height:26px; margin-left:-13px; border:2px solid var(--nex4-gold); border-radius:50%; opacity:0; animation:tap-ripple 3s ease-out infinite; }
.chip { position:absolute; width:38px; height:38px; border:1px solid rgba(255,255,255,.14); border-radius:11px; background:linear-gradient(140deg,rgba(221,168,18,.5),rgba(221,168,18,.08)); animation:float-y 5s ease-in-out infinite; }
.chip--a { top:40px; left:14%; rotate:-10deg; }
.chip--b { bottom:36px; right:13%; rotate:12deg; animation-delay:-2.4s; background:linear-gradient(140deg,rgba(96,165,250,.5),rgba(96,165,250,.08)); }

/* ---------- Marketing ---------- */
.chart { position:absolute; inset:34px 22px 44px; width:calc(100% - 44px); height:calc(100% - 78px); overflow:visible; }
.chart-grid { fill:none; stroke:rgba(255,255,255,.06); stroke-dasharray:3 5; }
.chart-line { fill:none; stroke:var(--nex4-gold); stroke-width:3; stroke-linecap:round; vector-effect:non-scaling-stroke; stroke-dasharray:1; animation:line-draw 6s var(--motion-ease) infinite; filter:drop-shadow(0 0 6px rgba(221,168,18,.7)); }
.chart-area { animation:area-fade 6s ease infinite; }
.chart-dot { position:absolute; top:44px; right:17px; width:11px; height:11px; border:2px solid #05070d; border-radius:50%; background:#fff1b8; box-shadow:0 0 0 0 rgba(221,168,18,.6); animation:dot-pop 6s ease infinite; }
.bars { position:absolute; inset:auto 22px 14px; height:22px; display:flex; align-items:flex-end; gap:6px; }
.bars i { flex:1; border-radius:3px 3px 0 0; background:rgba(255,255,255,.14); transform-origin:bottom; animation:bars-rise 6s var(--motion-ease) infinite; }
.bars i:nth-child(1) { height:30%; }
.bars i:nth-child(2) { height:48%; animation-delay:.12s; }
.bars i:nth-child(3) { height:42%; animation-delay:.24s; }
.bars i:nth-child(4) { height:74%; animation-delay:.36s; }
.bars i:nth-child(5) { height:100%; animation-delay:.48s; background:rgba(221,168,18,.75); }
.react { position:absolute; bottom:40px; color:var(--nex4-coral); font-size:16px; opacity:0; animation:react-rise 4s ease-out infinite; }
.react--1 { left:24%; }
.react--2 { left:52%; animation-delay:-1.4s; font-size:12px; }
.react--3 { left:74%; animation-delay:-2.7s; color:var(--nex4-green-bright); }

@keyframes float-y { 50% { translate:0 -9px; } }
@keyframes block-in { 0%,3% { opacity:0; transform:translateY(10px) scale(.94); } 9%,88% { opacity:1; transform:none; } 96%,100% { opacity:0; transform:none; } }
@keyframes button-press { 0%,58%,66%,100% { scale:1; box-shadow:0 0 0 0 rgba(221,168,18,.5); } 62% { scale:.88; box-shadow:0 0 0 9px rgba(221,168,18,0); } }
@keyframes cursor-path { 0%,30% { transform:translate(120px,180px); } 55%,70% { transform:translate(-72px,118px); opacity:1; } 62% { transform:translate(-72px,118px) scale(.82); } 90%,100% { transform:translate(-150px,200px); opacity:0; } }
@keyframes phone-tilt { 0%,100% { transform:rotate(-5deg); } 50% { transform:rotate(5deg) translateY(-6px); } }
@keyframes screens-swipe { 0%,26% { transform:translateX(0); } 33%,59% { transform:translateX(-33.333%); } 66%,92% { transform:translateX(-66.666%); } 100% { transform:translateX(0); } }
@keyframes toast-drop { 0%,8% { transform:translateY(-52px); } 13%,24% { transform:translateY(0); } 29%,100% { transform:translateY(-52px); } }
@keyframes tap-ripple { 0% { transform:scale(.4); opacity:.9; } 70%,100% { transform:scale(2.6); opacity:0; } }
@keyframes line-draw { 0% { stroke-dashoffset:1; } 45%,90% { stroke-dashoffset:0; opacity:1; } 100% { stroke-dashoffset:0; opacity:0; } }
@keyframes area-fade { 0%,30% { opacity:0; } 55%,90% { opacity:1; } 100% { opacity:0; } }
@keyframes dot-pop { 0%,42% { transform:scale(0); } 48% { transform:scale(1.5); } 54%,90% { transform:scale(1); box-shadow:0 0 0 10px rgba(221,168,18,0); } 100% { transform:scale(0); } }
@keyframes bars-rise { 0%,6% { transform:scaleY(0); } 30%,90% { transform:scaleY(1); } 100% { transform:scaleY(0); } }
@keyframes react-rise { 0% { transform:translateY(0) scale(.5); opacity:0; } 20% { opacity:1; } 100% { transform:translateY(-120px) scale(1.2) rotate(18deg); opacity:0; } }

@media (max-width:900px) { .scenes { grid-template-columns:1fr; } .stage { height:210px; } }
@media (prefers-reduced-motion:reduce) { .block,.cursor,.chart-area { opacity:1; } .chart-line { stroke-dashoffset:0; } .bars i { transform:none; } .cursor { transform:translate(-72px,118px); } .react { display:none; } }
</style>
