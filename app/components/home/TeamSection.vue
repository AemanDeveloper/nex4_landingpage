<script setup lang="ts">
import { team } from "~/data/home";
import ArrowUpRightIcon from "~/components/ui/ArrowUpRightIcon.vue";
</script>

<template>
  <section id="team" class="section team-section">
    <div class="container">
      <div class="team-header">
        <div>
          <div class="section-label">04 / THE PEOPLE</div>
          <h2 class="section-title">Meet the team <br /><span>behind NEX4.</span></h2>
        </div>
        <p>Different skills working together to build, launch and grow useful digital products.</p>
      </div>

      <div class="team-grid">
        <article v-for="(member, index) in team" :key="member.name" class="team-card">
          <div class="team-identity">
            <div class="identity-grid" aria-hidden="true" />
            <span class="team-number">0{{ index + 1 }}</span>
            <div class="initials" aria-hidden="true">{{ member.initials }}</div>
            <span class="member-state"><i />NEX4</span>
          </div>

          <div class="team-details">
            <div><h3>{{ member.name }}</h3><p>{{ member.role }}</p></div>
            <span>{{ member.department }}</span>
          </div>

          <div class="team-action">
            <a v-if="member.portfolioUrl" :href="member.portfolioUrl" target="_blank" rel="noopener noreferrer">
              {{ member.portfolioLabel }} <ArrowUpRightIcon />
            </a>
            <span v-else class="portfolio-disabled" aria-disabled="true">{{ member.portfolioLabel }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.team-section { border-top:1px solid var(--nex4-border); background:var(--nex4-bg-soft); }
.team-header { display:grid; grid-template-columns:1fr 400px; align-items:end; gap:60px; margin-bottom:65px; }
.team-header > p { color:var(--nex4-text-secondary); font-size:16px; line-height:1.8; }
.team-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:15px; }
.team-card { overflow:hidden; border:1px solid var(--nex4-border); border-radius:18px; background:rgba(255,255,255,.012); transition:.3s ease; }
.team-card:hover { transform:translateY(-6px); border-color:var(--nex4-border-green); }
.team-identity { position:relative; height:330px; display:flex; align-items:center; justify-content:center; overflow:hidden; background:radial-gradient(circle at center,rgba(50,239,69,.08),transparent 50%),#070c08; }
.identity-grid { position:absolute; inset:0; opacity:.4; background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px); background-size:35px 35px; mask-image:radial-gradient(circle,black,transparent 70%); }
.initials { position:relative; z-index:2; color:rgba(255,255,255,.1); font-family:"Manrope",sans-serif; font-size:96px; font-weight:800; letter-spacing:-7px; transition:.3s ease; }
.team-card:hover .initials { color:rgba(50,239,69,.2); transform:scale(1.04); }
.team-number { position:absolute; top:20px; right:20px; color:var(--nex4-text-muted); font-size:12px; }
.member-state { position:absolute; bottom:18px; left:18px; display:flex; align-items:center; gap:7px; padding:7px 10px; border:1px solid var(--nex4-border); border-radius:999px; color:var(--nex4-text-muted); font-size:12px; }
.member-state i { width:5px; height:5px; border-radius:50%; background:var(--nex4-green); box-shadow:0 0 8px rgba(50,239,69,.8); }
.team-details { min-height:100px; display:flex; align-items:flex-end; justify-content:space-between; gap:20px; padding:22px; }
.team-details h3 { font-family:"Manrope",sans-serif; font-size:19px; }
.team-details p { margin-top:3px; color:var(--nex4-green); font-size:13px; }
.team-details > span { max-width:140px; color:var(--nex4-text-muted); font-size:12px; text-align:right; line-height:1.5; }
.team-action { padding:0 22px 22px; }
.team-action a,.portfolio-disabled { min-height:46px; display:flex; align-items:center; justify-content:space-between; padding:0 14px; border:1px solid var(--nex4-border); border-radius:10px; color:var(--nex4-text-secondary); font-size:14px; }
.team-action a:hover,.team-action a:focus-visible { border-color:var(--nex4-border-green); color:var(--nex4-text); outline:none; }
.team-action a :deep(svg) { color:var(--nex4-green); }
.portfolio-disabled { color:var(--nex4-text-muted); cursor:not-allowed; }

@media (max-width:900px) { .team-header { grid-template-columns:1fr; gap:30px; } .team-grid { grid-template-columns:1fr; } .team-identity { height:300px; } }
</style>
