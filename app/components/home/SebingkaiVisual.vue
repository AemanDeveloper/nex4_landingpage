<template>
  <div class="booth" aria-hidden="true">
    <div class="booth-glow" />

    <div class="polaroid">
      <div class="shot shot--wide"><i class="sun" /><i class="person" /><i class="person person--b" /><i class="person person--c" /></div>
      <span>sebingkai</span>
    </div>

    <div class="strip">
      <div v-for="frame in 3" :key="frame" class="shot" :class="`shot--${frame}`">
        <i class="person" /><i v-if="frame !== 2" class="person person--b" />
      </div>
      <span>one frame · one moment</span>
    </div>

    <div class="viewfinder">
      <i /><i /><i /><i />
      <div class="countdown"><b>3</b><b>2</b><b>1</b></div>
      <span class="rec"><em />READY</span>
    </div>

    <div class="flash" />
  </div>
</template>

<style scoped>
/* An illustrated photobooth: a countdown runs, the flash fires, the prints settle. One loop is 6s. */
.booth { position:absolute; inset:0; overflow:hidden; background:radial-gradient(circle at 70% 20%,rgba(241,118,86,.22),transparent 45%),radial-gradient(circle at 15% 90%,rgba(221,168,18,.2),transparent 45%),#0b0f1c; }
.booth-glow { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px); background-size:30px 30px; mask-image:radial-gradient(circle at 50% 40%,black,transparent 75%); }

.strip,.polaroid { position:absolute; background:var(--nex4-cream); box-shadow:0 30px 60px rgba(0,0,0,.55),0 2px 0 rgba(255,255,255,.5) inset; }
.strip { top:7%; left:14%; width:24%; min-width:104px; display:grid; gap:7px; padding:9px 9px 6px; border-radius:4px; transform:rotate(-7deg); transform-origin:50% -20%; animation:strip-sway 6s ease-in-out infinite; }
.strip > span,.polaroid > span { color:#6b5a2a; font-family:"Manrope",sans-serif; font-size:8px; font-weight:800; letter-spacing:.9px; text-align:center; text-transform:uppercase; white-space:nowrap; overflow:hidden; }
.polaroid { top:20%; right:9%; width:40%; min-width:150px; padding:10px 10px 8px; border-radius:5px; transform:rotate(6deg); animation:polaroid-settle 6s var(--motion-ease) infinite; }
.polaroid > span { display:block; margin-top:8px; font-size:13px; letter-spacing:-.3px; text-transform:none; }

.shot { position:relative; aspect-ratio:4/3; overflow:hidden; border-radius:2px; background:linear-gradient(160deg,#f2c94c,#dda812 55%,#9b7100); }
.shot--2 { background:linear-gradient(160deg,#ffb199,#f17656 60%,#a43f25); }
.shot--3 { background:linear-gradient(160deg,#2a3558,#121a2b 60%,#05070d); }
.shot--wide { aspect-ratio:5/4; background:linear-gradient(170deg,#1a2340 0%,#3a2f55 45%,#f17656 78%,#f2c94c 100%); }
.shot::after { content:""; position:absolute; inset:0; background:linear-gradient(120deg,rgba(255,255,255,.28),transparent 35%); }
.sun { position:absolute; top:16%; right:16%; width:20%; aspect-ratio:1; border-radius:50%; background:#fff1b8; box-shadow:0 0 26px 8px rgba(255,241,184,.55); }
/* Head and shoulders drawn with one element: the circle is the head, the shadow blob is the body. */
.person { position:absolute; bottom:38%; left:26%; width:17%; aspect-ratio:1; border-radius:50%; background:rgba(5,7,13,.82); }
.person::after { content:""; position:absolute; top:112%; left:-55%; width:210%; height:260%; border-radius:48% 48% 0 0; background:inherit; }
.person--b { left:56%; bottom:32%; width:15%; background:rgba(5,7,13,.6); }
.person--c { left:76%; bottom:26%; width:11%; background:rgba(5,7,13,.45); }
.shot--3 .person { background:rgba(221,168,18,.85); }
.shot--3 .person--b { background:rgba(250,247,240,.7); }
.shot--2 .person { left:41%; }

.viewfinder { position:absolute; inset:9% 7%; pointer-events:none; }
.viewfinder > i { position:absolute; width:22px; height:22px; border:2px solid rgba(250,247,240,.65); }
.viewfinder > i:nth-child(1) { top:0; left:0; border-right:0; border-bottom:0; }
.viewfinder > i:nth-child(2) { top:0; right:0; border-left:0; border-bottom:0; }
.viewfinder > i:nth-child(3) { bottom:0; left:0; border-right:0; border-top:0; }
.viewfinder > i:nth-child(4) { bottom:0; right:0; border-left:0; border-top:0; }
.countdown { position:absolute; top:6px; right:38px; display:grid; }
.countdown b { grid-area:1/1; color:var(--nex4-cream); font-family:"Manrope",sans-serif; font-size:34px; font-weight:800; line-height:1; opacity:0; text-shadow:0 4px 24px rgba(0,0,0,.6); animation:count-tick 6s linear infinite; }
.countdown b:nth-child(2) { animation-delay:.8s; }
.countdown b:nth-child(3) { animation-delay:1.6s; }
.rec { position:absolute; top:10px; left:36px; display:flex; align-items:center; gap:6px; color:rgba(250,247,240,.8); font-size:10px; font-weight:700; letter-spacing:1.4px; }
.rec em { width:7px; height:7px; border-radius:50%; background:var(--nex4-coral); box-shadow:0 0 10px var(--nex4-coral); animation:status-pulse 1.2s ease-in-out infinite; }
.flash { position:absolute; inset:0; background:#fff; opacity:0; pointer-events:none; animation:flash-fire 6s linear infinite; }

@keyframes count-tick { 0% { opacity:0; transform:scale(1.6); } 2% { opacity:1; transform:scale(1); } 11% { opacity:1; } 13%,100% { opacity:0; transform:scale(.7); } }
@keyframes flash-fire { 0%,40% { opacity:0; } 42% { opacity:.85; } 52%,100% { opacity:0; } }
@keyframes polaroid-settle { 0%,41% { opacity:0; transform:rotate(14deg) translateY(-26px) scale(.92); } 56%,100% { opacity:1; transform:rotate(6deg); } }
@keyframes strip-sway { 0%,100% { transform:rotate(-7deg); } 50% { transform:rotate(-4deg); } }

@media (prefers-reduced-motion:reduce) { .countdown b,.flash { animation:none; opacity:0; } .polaroid,.strip { animation:none; } }
</style>
