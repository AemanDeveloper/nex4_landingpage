<script setup lang="ts">
import { services } from "~/data/home";
</script>

<template>
  <section id="services" class="section services">
    <div class="container">
      <div class="services-header">
        <div>
          <div class="section-label" data-reveal>01 / SERVICES</div>
          <h2 class="section-title" data-reveal="mask">Everything you need<br /><span>to go digital.</span></h2>
        </div>
        <p data-reveal style="--reveal-delay: 120ms">Development and marketing working together to turn ideas into useful digital experiences.</p>
      </div>

      <div class="service-terminal" data-reveal="scale" data-spotlight aria-label="NEX4 services terminal">
        <div class="terminal-beam" aria-hidden="true" />
        <div class="terminal-bar">
          <div class="terminal-controls" aria-hidden="true"><i /><i /><i /></div>
          <span>NEX4 Studio — services</span>
          <span class="terminal-session">bash</span>
        </div>

        <div class="terminal-body">
          <div
            v-for="(service, index) in services"
            :key="service.title"
            class="terminal-command"
            :style="{
              '--command-delay': `${index * 1200 + 150}ms`,
              '--output-delay': `${index * 1200 + 820}ms`,
            }"
          >
            <div class="command-line">
              <span class="prompt">nex4@studio:~$</span>
              <span class="command">explore</span>
              <span class="flag">--service</span>
              <span class="argument">"{{ service.title }}"</span>
            </div>
            <div class="command-output">
              <span class="output-number">{{ service.number }}</span>
              <div>
                <h3>{{ service.title }}</h3>
                <p>{{ service.description }}</p>
                <ul>
                  <li v-for="item in service.items" :key="item"><span>✓</span>{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>

          <a href="#contact" class="terminal-ready">
            <span class="prompt">nex4@studio:~$</span>
            <span class="ready-command"><span class="command">start</span> <span class="flag">--project</span> <span class="argument">"yours"</span></span>
            <span class="cursor" aria-hidden="true" />
            <span class="ready-hint">press to begin ↵</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services { border-top:1px solid var(--nex4-border); background:linear-gradient(180deg,var(--nex4-bg),var(--nex4-bg-soft)); }
.services-header { display:grid; grid-template-columns:1fr 400px; align-items:end; gap:60px; margin-bottom:65px; }
.services-header > p { color:var(--nex4-text-secondary); line-height:1.8; }
.service-terminal { position:relative; overflow:hidden; border:1px solid rgba(255,255,255,.11); border-radius:18px; background:#090b0a; box-shadow:0 35px 100px rgba(0,0,0,.35),inset 0 1px rgba(255,255,255,.04); }
.terminal-bar { min-height:52px; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; padding:0 18px; border-bottom:1px solid rgba(255,255,255,.08); background:linear-gradient(180deg,#171a18,#111311); color:#9ba19c; font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; font-size:12px; }
.terminal-controls { display:flex; gap:8px; }
.terminal-controls i { width:11px; height:11px; border-radius:50%; background:#ff5f57; }
.terminal-controls i:nth-child(2) { background:#febc2e; }
.terminal-controls i:nth-child(3) { background:#28c840; }
.terminal-session { justify-self:end; color:#666d67; }
.terminal-body { min-height:570px; padding:34px 38px 36px; font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; }
.terminal-command { padding:0 0 30px; }
.command-line { display:flex; flex-wrap:wrap; gap:8px; clip-path:inset(0 100% 0 0); opacity:0; color:#e7ece8; font-size:13px; line-height:1.7; }
.service-terminal.is-visible .command-line { animation:terminal-type .72s steps(28,end) forwards; animation-delay:var(--command-delay); }
.prompt { color:#28c840; }
.command { color:#f4f7f5; }
.flag { color:#60a5fa; }
.argument { color:#fbbf24; }
.command-output { display:grid; grid-template-columns:54px 1fr; gap:18px; margin-top:15px; padding:22px; border:1px solid rgba(255,255,255,.075); border-radius:12px; opacity:0; transform:translateY(10px); background:rgba(255,255,255,.018); transition:border-color var(--motion-fast) ease,background var(--motion-fast) ease,translate var(--motion-medium) var(--motion-ease); }
.service-terminal.is-visible .command-output { animation:terminal-output .5s var(--motion-ease) forwards; animation-delay:var(--output-delay); }
.command-output:hover { border-color:rgba(221,168,18,.3); background:rgba(221,168,18,.035); translate:6px 0; }
.command-output:hover .output-number { color:var(--nex4-gold); }
.output-number { color:#626b64; font-size:12px; transition:color var(--motion-fast) ease; }
h3 { color:#f5f7f5; font-family:"Manrope",sans-serif; font-size:21px; letter-spacing:-.6px; }
.command-output p { max-width:720px; margin-top:5px; color:#8f9991; font-family:"DM Sans",sans-serif; font-size:14px; line-height:1.65; }
ul { display:flex; flex-wrap:wrap; gap:8px 20px; margin-top:14px; list-style:none; }
li { color:#aab2ac; font-size:12px; }
li span { margin-right:7px; color:#28c840; }
.terminal-ready { position:relative; z-index:1; display:flex; flex-wrap:wrap; align-items:center; gap:9px; width:fit-content; padding:8px 12px; margin-left:-12px; border-radius:9px; opacity:0; color:#eef2ef; font-size:13px; transition:background var(--motion-fast) ease; }
.terminal-ready:hover,.terminal-ready:focus-visible { background:rgba(221,168,18,.08); }
.ready-command { clip-path:inset(0 100% 0 0); }
.service-terminal.is-visible .ready-command { animation:terminal-type .9s steps(22,end) 4.2s forwards; }
.ready-hint { margin-left:8px; color:#626b64; font-size:11px; opacity:0; transition:opacity var(--motion-fast) ease; }
.terminal-ready:hover .ready-hint,.terminal-ready:focus-visible .ready-hint { opacity:1; }
/* A slow light sweep across the terminal glass. */
.terminal-beam { position:absolute; z-index:2; inset:0; pointer-events:none; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.035) 50%,transparent 60%); background-size:250% 100%; animation:terminal-beam 9s linear infinite; }
.terminal-bar,.terminal-body { position:relative; z-index:1; }
@keyframes terminal-beam { from { background-position:120% 0; } to { background-position:-130% 0; } }
.service-terminal.is-visible .terminal-ready { animation:terminal-output .35s var(--motion-ease) 3.75s forwards; }
.cursor { width:8px; height:16px; background:#d7ddd8; animation:cursor-blink 1s steps(1) infinite; }
@keyframes terminal-type { to { clip-path:inset(0 0 0 0); opacity:1; } }
@keyframes terminal-output { to { opacity:1; transform:translateY(0); } }
@keyframes cursor-blink { 50% { opacity:0; } }
@media (max-width:850px) { .services-header { grid-template-columns:1fr; gap:28px; } .terminal-body { min-height:0; padding:25px 20px; } .terminal-command { padding-bottom:24px; } }
@media (max-width:520px) { .terminal-bar { grid-template-columns:1fr auto; } .terminal-bar > span:first-of-type { justify-self:end; } .terminal-session { display:none; } .command-output { grid-template-columns:1fr; gap:8px; padding:17px; } .command-line { gap:5px 7px; font-size:11px; } ul { display:grid; grid-template-columns:1fr 1fr; gap:7px; } }
@media (prefers-reduced-motion:reduce) { .command-line,.command-output,.terminal-ready,.ready-command { clip-path:none; opacity:1; transform:none; animation:none !important; } }
</style>
