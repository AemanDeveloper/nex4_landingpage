<script setup lang="ts">
import { services } from "~/data/home";
</script>

<template>
  <section id="services" class="section services">
    <div class="container">
      <div class="services-header">
        <div>
          <div class="section-label">01 / SERVICES</div>
          <h2 class="section-title">Everything you need<br /><span>to go digital.</span></h2>
        </div>
        <p>Development and marketing working together to turn ideas into useful digital experiences.</p>
      </div>

      <div class="service-terminal" aria-label="NEX4 services terminal">
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

          <div class="terminal-ready">
            <span class="prompt">nex4@studio:~$</span><span class="cursor" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services { border-top:1px solid var(--nex4-border); background:linear-gradient(180deg,var(--nex4-bg),var(--nex4-bg-soft)); }
.services-header { display:grid; grid-template-columns:1fr 400px; align-items:end; gap:60px; margin-bottom:65px; }
.services-header > p { color:var(--nex4-text-secondary); line-height:1.8; }
.service-terminal { overflow:hidden; border:1px solid rgba(255,255,255,.11); border-radius:18px; background:#080b12; box-shadow:0 35px 100px rgba(0,0,0,.35),inset 0 1px rgba(255,255,255,.04); }
.terminal-bar { min-height:52px; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; padding:0 18px; border-bottom:1px solid rgba(255,255,255,.08); background:linear-gradient(180deg,#171c29,#0f1420); color:#aab0bc; font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; font-size:12px; }
.terminal-controls { display:flex; gap:8px; }
.terminal-controls i { width:11px; height:11px; border-radius:50%; background:#ff5f57; }
.terminal-controls i:nth-child(2) { background:#febc2e; }
.terminal-controls i:nth-child(3) { background:#28c840; }
.terminal-session { justify-self:end; color:#666d67; }
.terminal-body { min-height:570px; padding:34px 38px 36px; font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; }
.terminal-command { padding:0 0 30px; }
.command-line { display:flex; flex-wrap:wrap; gap:8px; clip-path:inset(0 100% 0 0); opacity:0; color:#e7ece8; font-size:13px; line-height:1.7; }
.service-terminal.is-visible .command-line { animation:terminal-type .72s steps(28,end) forwards; animation-delay:var(--command-delay); }
.prompt { color:var(--nex4-gold); }
.command { color:#f4f7f5; }
.flag { color:#60a5fa; }
.argument { color:#fbbf24; }
.command-output { display:grid; grid-template-columns:54px 1fr; gap:18px; margin-top:15px; padding:22px; border:1px solid rgba(255,255,255,.075); border-radius:12px; opacity:0; transform:translateY(10px); background:rgba(255,255,255,.018); transition:border-color var(--motion-fast) ease,background var(--motion-fast) ease; }
.service-terminal.is-visible .command-output { animation:terminal-output .5s var(--motion-ease) forwards; animation-delay:var(--output-delay); }
.command-output:hover { border-color:rgba(221,168,18,.28); background:rgba(221,168,18,.035); }
.output-number { color:#626b64; font-size:12px; }
h3 { color:#f5f7f5; font-family:"Manrope",sans-serif; font-size:21px; letter-spacing:-.6px; }
.command-output p { max-width:720px; margin-top:5px; color:#8f9991; font-family:"DM Sans",sans-serif; font-size:14px; line-height:1.65; }
ul { display:flex; flex-wrap:wrap; gap:8px 20px; margin-top:14px; list-style:none; }
li { color:#aab2ac; font-size:12px; }
li span { margin-right:7px; color:var(--nex4-gold); }
.terminal-ready { display:flex; align-items:center; gap:9px; opacity:0; color:#eef2ef; font-size:13px; }
.service-terminal.is-visible .terminal-ready { animation:terminal-output .35s var(--motion-ease) 3.75s forwards; }
.cursor { width:8px; height:16px; background:#d7ddd8; animation:cursor-blink 1s steps(1) infinite; }
@keyframes terminal-type { to { clip-path:inset(0 0 0 0); opacity:1; } }
@keyframes terminal-output { to { opacity:1; transform:translateY(0); } }
@keyframes cursor-blink { 50% { opacity:0; } }
@media (max-width:850px) { .services-header { grid-template-columns:1fr; gap:28px; } .terminal-body { min-height:0; padding:25px 20px; } .terminal-command { padding-bottom:24px; } }
@media (max-width:520px) { .terminal-bar { grid-template-columns:1fr auto; } .terminal-bar > span:first-of-type { justify-self:end; } .terminal-session { display:none; } .command-output { grid-template-columns:1fr; gap:8px; padding:17px; } .command-line { gap:5px 7px; font-size:11px; } ul { display:grid; grid-template-columns:1fr 1fr; gap:7px; } }
@media (prefers-reduced-motion:reduce) { .command-line,.command-output,.terminal-ready { clip-path:none; opacity:1; transform:none; animation:none !important; } }
</style>
