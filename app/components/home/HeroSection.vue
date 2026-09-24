<script setup lang="ts">
import ArrowUpRightIcon from "~/components/ui/ArrowUpRightIcon.vue";
import NoiseBackgroundButton from "~/components/ui/NoiseBackgroundButton.vue";
</script>

<template>
  <section id="home" class="hero">
    <div class="background-grid" aria-hidden="true" />
    <div class="aurora" aria-hidden="true">
      <div class="aurora-layer" />
      <div class="aurora-glow" />
    </div>

    <div class="container hero-container">
      <div class="hero-content">
        <div class="eyebrow"><span /> NEX4 DIGITAL STUDIO</div>
        <h1>We build digital <em>products</em><br />that move businesses forward.</h1>
        <p>Websites, mobile applications and digital marketing brought together by one creative technology team.</p>
        <div class="hero-actions">
          <NoiseBackgroundButton href="#contact" label="Start a Project" />
          <a href="#work" class="secondary-button">View Our Work</a>
        </div>

        <div class="project-signals" aria-label="Live NEX4 products">
          <a href="https://nutritrack.nex4.my" target="_blank" rel="noopener noreferrer">
            <span class="signal-status"><i />LIVE</span>
            <strong>NutriTrack</strong>
            <ArrowUpRightIcon />
          </a>
          <a href="https://crm.nex4.my" target="_blank" rel="noopener noreferrer">
            <span class="signal-status"><i />BETA</span>
            <strong>Nex4 CRM</strong>
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>
    </div>

    <div class="hero-services" aria-label="NEX4 services">
      <div class="services-track">
        <div class="services-row">
          <span>Web Development</span><i /><span>Mobile Applications</span><i />
          <span>AI Integration</span><i /><span>Digital Marketing</span><i /><span>Digital Products</span><i />
        </div>
        <div class="services-row" aria-hidden="true">
          <span>Web Development</span><i /><span>Mobile Applications</span><i />
          <span>AI Integration</span><i /><span>Digital Marketing</span><i /><span>Digital Products</span><i />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { position:relative; min-height:max(720px,100svh); display:flex; align-items:center; overflow:hidden; padding:150px 0 120px; background:#000; }
.background-grid { position:absolute; inset:-64px; opacity:.55; background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px); background-size:64px 64px; mask-image:linear-gradient(to bottom,transparent,black 20%,black 82%,transparent); animation:grid-drift 18s linear infinite; }
.aurora { position:absolute; z-index:1; inset:0; overflow:hidden; pointer-events:none; mask-image:linear-gradient(to bottom,black 0%,black 72%,transparent 100%); }
.aurora-layer { position:absolute; inset:-45%; opacity:0; background-image:repeating-linear-gradient(100deg,#000 0%,#000 7%,transparent 10%,transparent 12%,#000 16%),repeating-linear-gradient(100deg,#3b82f6 10%,#a5b4fc 15%,#93c5fd 20%,#ddd6fe 25%,#60a5fa 30%); background-size:300% 220%,200% 180%; background-position:50% 50%,50% 50%; filter:blur(36px) saturate(1.25); transform:rotate(-8deg) scale(1.12); mix-blend-mode:screen; animation:aurora-enter 1.2s .05s var(--motion-ease) forwards,aurora-shift 60s 1.2s linear infinite; }
.aurora-layer::after { content:""; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 15%,rgba(129,140,248,.42),rgba(5,7,12,0) 55%); }
.aurora-glow { position:absolute; top:-18%; left:50%; width:min(1040px,120vw); height:700px; transform:translateX(-50%); border-radius:50%; background:radial-gradient(ellipse,rgba(96,165,250,.17),rgba(139,92,246,.07) 45%,transparent 72%); filter:blur(45px); animation:soft-pulse 9s ease-in-out infinite; }
.hero-container { position:relative; z-index:2; display:flex; justify-content:center; }
.hero-content { width:min(100%,1080px); padding-top:125px; text-align:center; animation:hero-enter var(--motion-slow) .3s both var(--motion-ease); }
.eyebrow { display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:24px; color:var(--nex4-text-secondary); font-size:12px; font-weight:700; letter-spacing:2px; }
.eyebrow span { width: 7px; height: 7px; border-radius: 50%; background: var(--nex4-green); box-shadow: 0 0 14px rgba(50,239,69,.8); }
h1 { max-width:1050px; margin:0 auto; font-family:"Manrope",sans-serif; font-size:clamp(58px,6.3vw,92px); font-weight:600; line-height:.98; letter-spacing:-5.5px; text-wrap:balance; }
h1 em { color: transparent; font-style: normal; background: var(--nex4-gradient); background-clip: text; -webkit-background-clip: text; }
.hero-content > p { max-width:650px; margin:28px auto 0; color:var(--nex4-text-secondary); font-size:17px; line-height:1.75; }
.hero-actions { display:flex; justify-content:center; gap:12px; margin-top:34px; }
.project-signals { width:min(100%,530px); display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:34px auto 0; }
.project-signals a { position:relative; isolation:isolate; min-height:60px; display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:12px; overflow:hidden; padding:10px 14px; border:1px solid transparent; border-radius:14px; text-align:left; backdrop-filter:blur(16px); transition:transform var(--motion-fast) var(--motion-ease),box-shadow var(--motion-fast) var(--motion-ease); }
.project-signals a::before { content:""; position:absolute; z-index:-2; inset:-220%; background:conic-gradient(from 0deg,transparent 0 76%,rgba(50,239,69,.12) 82%,#32ef45 90%,#c9ffd0 94%,transparent 100%); animation:moving-border 3.4s linear infinite; }
.project-signals a::after { content:""; position:absolute; z-index:-1; inset:1px; border-radius:12px; background:rgba(4,6,10,.92); }
.project-signals a:hover,.project-signals a:focus-visible { transform:translateY(-2px); box-shadow:0 12px 35px rgba(50,239,69,.1); outline:none; }
.project-signals strong { font-size:14px; }
.project-signals > a > :deep(svg) { color:var(--nex4-green); font-size:15px; }
.signal-status { display:flex; align-items:center; gap:6px; color:var(--nex4-text-muted); font-size:10px; font-weight:700; letter-spacing:.8px; }
.signal-status i { width:6px; height:6px; border-radius:50%; background:var(--nex4-green); box-shadow:0 0 9px rgba(50,239,69,.75); animation:status-pulse 1.8s ease-in-out infinite; }
.hero-services { position:absolute; z-index:3; bottom:0; width:100%; overflow:hidden; border-top:1px solid var(--nex4-border); background:rgba(255,255,255,.01); }
.services-track { display:flex; width:max-content; animation:services-marquee 25s linear infinite; }
.hero-services:hover .services-track { animation-play-state:paused; }
.services-row { min-height:65px; display:flex; align-items:center; gap:54px; padding-right:54px; color:var(--nex4-text-muted); font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; white-space:nowrap; }
.services-row i { width:4px; height:4px; flex-shrink:0; border-radius:50%; background:var(--nex4-green); }

@keyframes hero-enter { from { opacity:0; transform:translateY(28px); } }
@keyframes aurora-enter { from { opacity:0; transform:rotate(-8deg) scale(.9); } to { opacity:.32; transform:rotate(-8deg) scale(1.12); } }
@keyframes aurora-shift { from { background-position:50% 50%,50% 50%; } to { background-position:350% 50%,350% 50%; } }
@keyframes moving-border { to { transform:rotate(1turn); } }
@keyframes services-marquee { to { transform:translateX(-50%); } }

@media (max-width:700px) {
  .hero { min-height:max(760px,100svh); padding:120px 0 105px; }
  .aurora-layer { inset:-35% -90%; filter:blur(28px) saturate(1.1); }
  .aurora-glow { top:-8%; width:150vw; height:520px; }
  .hero-content { padding-top:86px; }
  .eyebrow { margin-bottom:20px; font-size:11px; }
  h1 { font-size:clamp(42px,12vw,52px); line-height:1.01; letter-spacing:-3.1px; }
  h1 br { display:none; }
  .hero-content > p { margin-top:23px; font-size:16px; line-height:1.65; }
  .hero-actions { flex-direction:column; margin-top:28px; }
  .hero-actions a { width:100%; }
  .project-signals { margin-top:22px; gap:8px; }
  .project-signals a { min-height:56px; padding:9px 10px; gap:8px; }
  .project-signals strong { font-size:13px; }
  .signal-status { font-size:9px; }
  .services-track { animation-duration:18s; }
  .services-row { gap:34px; padding-right:34px; }
}
</style>
