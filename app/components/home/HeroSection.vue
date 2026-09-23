<template>
  <section id="home" class="hero">
    <div class="background-grid" aria-hidden="true" />
    <div class="glow" aria-hidden="true" />

    <div class="container hero-container">
      <div class="hero-content">
        <div class="eyebrow"><span /> NEX4 DIGITAL STUDIO</div>
        <h1>We build digital <em>products</em> that help businesses grow.</h1>
        <p>Websites, mobile applications and digital marketing brought together by one creative technology team.</p>
        <div class="hero-actions">
          <a href="#contact" class="primary-button">Start a Project <span aria-hidden="true">↗</span></a>
          <a href="#work" class="secondary-button">View Our Work</a>
        </div>
      </div>

      <div class="hero-showcase">
        <div class="signal-frame" aria-hidden="true" />
        <div class="studio-panel">
          <div class="panel-heading">
            <span>NEX4 / LIVE NETWORK</span>
            <span class="availability"><i />ONLINE</span>
          </div>

          <div class="network-mark">
            <img src="/images/nex4-icon.png" alt="NEX4" />
          </div>

          <div class="project-signals">
            <a href="https://nutritrack.nex4.my" target="_blank" rel="noopener noreferrer">
              <span class="signal-index">01</span>
              <span><strong>NutriTrack</strong><small>Live application</small></span>
              <b aria-hidden="true">↗</b>
            </a>
            <a href="https://crm.nex4.my" target="_blank" rel="noopener noreferrer">
              <span class="signal-index">02</span>
              <span><strong>Nex4 CRM</strong><small>Public beta</small></span>
              <b aria-hidden="true">↗</b>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="hero-services">
      <div class="container services-row">
        <span>Web Development</span><i /><span>Mobile Applications</span><i />
        <span>AI Integration</span><i /><span>Digital Marketing</span><i /><span>Digital Products</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; min-height: 100vh; display: flex; align-items: center; overflow: hidden; padding: 145px 0 100px; background: var(--nex4-bg); }
.background-grid { position: absolute; inset: -64px; background-image: linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px); background-size: 64px 64px; mask-image: linear-gradient(to bottom,transparent,black 15%,black 75%,transparent); animation:grid-drift 18s linear infinite; }
.glow { position: absolute; width: 760px; height: 760px; right: -380px; top: -160px; border-radius: 50%; background: rgba(0,150,45,.13); filter: blur(150px); animation:soft-pulse 8s ease-in-out infinite; }
.hero-container { position: relative; z-index: 2; display: grid; grid-template-columns: 1.05fr .95fr; gap: 90px; align-items: center; }
.eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 27px; color: var(--nex4-text-secondary); font-size: 12px; font-weight: 700; letter-spacing: 2px; }
.eyebrow span { width: 7px; height: 7px; border-radius: 50%; background: var(--nex4-green); box-shadow: 0 0 14px rgba(50,239,69,.8); }
h1 { max-width: 720px; font-family: "Manrope",sans-serif; font-size: clamp(54px,5vw,78px); font-weight: 600; line-height: 1.02; letter-spacing: -4px; }
h1 em { color: transparent; font-style: normal; background: var(--nex4-gradient); background-clip: text; -webkit-background-clip: text; }
.hero-content { animation:hero-enter .8s .1s both cubic-bezier(.2,.7,.2,1); }
.hero-content > p { max-width: 570px; margin-top: 28px; color: var(--nex4-text-secondary); font-size: 17px; line-height: 1.8; }
.hero-actions { display: flex; gap: 12px; margin-top: 36px; }
.hero-showcase { position: relative; min-height: 560px; display: grid; place-items: center; }
.signal-frame { position: absolute; inset: 54px 20px; border: 1px solid rgba(50,239,69,.1); border-radius: 30px; transform: rotate(4deg); animation:frame-float 8s ease-in-out infinite; }
.studio-panel { position: relative; z-index: 2; width: min(100%,470px); padding: 20px; border: 1px solid rgba(255,255,255,.1); border-radius: 24px; background: linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.012)); box-shadow: 0 50px 100px rgba(0,0,0,.5); backdrop-filter: blur(20px); animation:panel-enter .9s .2s both cubic-bezier(.2,.7,.2,1),panel-float 7s 1.1s ease-in-out infinite; }
.panel-heading { display: flex; justify-content: space-between; align-items: center; padding: 0 4px 18px; color: var(--nex4-text-muted); font-size: 12px; letter-spacing: 1.1px; }
.availability { display: flex; align-items: center; gap: 6px; }
.availability i { width: 6px; height: 6px; border-radius: 50%; background: var(--nex4-green); box-shadow: 0 0 8px var(--nex4-green); animation:status-pulse 1.8s ease-in-out infinite; }
.network-mark { position: relative; min-height: 255px; display: flex; align-items: center; justify-content: center; gap: 2px; overflow: hidden; border-radius: 17px; background: linear-gradient(rgba(50,239,69,.075) 1px,transparent 1px),linear-gradient(90deg,rgba(50,239,69,.075) 1px,transparent 1px),#030603; background-size: 32px 32px; }
.network-mark::before { content:""; position:absolute; width:270px; height:270px; top:-90px; left:50%; transform:translateX(-50%); border-radius:50%; background:rgba(50,239,69,.18); filter:blur(80px); }
.network-mark img { position:relative; z-index:1; width:min(58%,220px); aspect-ratio:1; border-radius:20px; object-fit:cover; box-shadow:0 24px 70px rgba(0,0,0,.45); animation:logo-float 5s ease-in-out infinite; }
.project-signals { display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-top:16px; }
.project-signals a { min-height:70px; display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:10px; padding:12px; border:1px solid var(--nex4-border); border-radius:12px; background:rgba(255,255,255,.015); transition:.25s ease; }
.project-signals a:hover,.project-signals a:focus-visible { border-color:var(--nex4-border-green); background:rgba(50,239,69,.04); outline:none; }
.project-signals strong,.project-signals small { display:block; }
.project-signals strong { font-size:14px; }
.project-signals small { margin-top:2px; color:var(--nex4-text-muted); font-size:12px; }
.signal-index,.project-signals b { color:var(--nex4-green); font-size:12px; }
.hero-services { position:absolute; z-index:3; bottom:0; width:100%; border-top:1px solid var(--nex4-border); background:rgba(255,255,255,.01); }
.services-row { min-height:65px; display:flex; align-items:center; justify-content:space-between; gap:20px; color:var(--nex4-text-muted); font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; }
.services-row i { width:4px; height:4px; flex-shrink:0; border-radius:50%; background:var(--nex4-green); }

@keyframes hero-enter { from { opacity:0; transform:translateY(28px); } }
@keyframes panel-enter { from { opacity:0; transform:translateY(34px) scale(.97); } }
@keyframes panel-float { 50% { transform:translateY(-8px); } }
@keyframes frame-float { 50% { transform:rotate(2.5deg) scale(1.015); } }
@keyframes logo-float { 50% { transform:translateY(-7px) scale(1.015); } }

@media (max-width:1050px) { .hero-container { grid-template-columns:1fr; gap:50px; } .hero-showcase { min-height:500px; } }
@media (max-width:700px) { .hero { min-height:auto; padding:125px 0 115px; } .hero-container { gap:45px; } h1 { font-size:46px; letter-spacing:-2.7px; } .hero-content > p { font-size:16px; } .hero-actions { flex-direction:column; } .hero-actions a { width:100%; } .hero-showcase { min-height:420px; } .studio-panel { padding:14px; } .network-mark { min-height:205px; } .project-signals { grid-template-columns:1fr; } .project-signals a { min-height:58px; } .signal-frame { inset:30px 10px; } .services-row { overflow:hidden; justify-content:flex-start; white-space:nowrap; } }
</style>
