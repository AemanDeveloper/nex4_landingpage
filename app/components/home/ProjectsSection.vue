<script setup lang="ts">
import { projects } from "~/data/home";
</script>

<template>
  <section id="work" class="section projects-section">
    <div class="container">
      <div class="projects-header">
        <div>
          <div class="section-label">02 / SELECTED WORK</div>
          <h2 class="section-title">Products in the <br /><span>NEX4 network.</span></h2>
        </div>
        <p>Live digital products built and maintained by the NEX4 team.</p>
      </div>

      <div class="projects-list">
        <article v-for="project in projects" :key="project.title" class="project-card">
          <div class="project-content">
            <span class="project-number">{{ project.number }}</span>
            <div class="project-category">{{ project.category }}</div>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-tags"><span v-for="tag in project.tags" :key="tag">{{ tag }}</span></div>
            <a :href="project.link" target="_blank" rel="noopener noreferrer" class="project-link">
              {{ project.linkText }} <span aria-hidden="true">↗</span>
            </a>
          </div>

          <a :href="project.link" target="_blank" rel="noopener noreferrer" class="project-visual" :aria-label="`${project.linkText}: ${project.title}`">
            <div class="domain-card">
              <div class="domain-status"><i />{{ project.status }}</div>
              <div class="domain-monogram" aria-hidden="true">{{ project.number }}</div>
              <div class="domain-info">
                <span>NEX4 NETWORK</span>
                <strong>{{ project.domain }}</strong>
              </div>
              <span class="domain-arrow" aria-hidden="true">↗</span>
            </div>
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-section { border-top:1px solid var(--nex4-border); background:#050805; }
.projects-header { display:grid; grid-template-columns:1fr 400px; align-items:end; gap:60px; margin-bottom:70px; }
.projects-header > p { color:var(--nex4-text-secondary); font-size:16px; line-height:1.8; }
.projects-list { display:grid; gap:28px; }
.project-card { min-height:560px; display:grid; grid-template-columns:.88fr 1.12fr; align-items:center; gap:70px; padding:60px; border:1px solid var(--nex4-border); border-radius:24px; background:linear-gradient(145deg,rgba(255,255,255,.025),rgba(255,255,255,.005)); transition:border-color .3s ease,box-shadow .3s ease; }
.project-card:hover { border-color:rgba(50,239,69,.2); box-shadow:0 35px 100px rgba(0,0,0,.22); }
.project-content { position:relative; }
.project-number { position:absolute; top:-72px; left:-10px; color:rgba(255,255,255,.025); font-family:"Manrope",sans-serif; font-size:120px; font-weight:800; }
.project-category { position:relative; z-index:2; margin-bottom:18px; color:var(--nex4-green); font-size:12px; font-weight:700; letter-spacing:1.6px; }
.project-content h3 { position:relative; z-index:2; font-family:"Manrope",sans-serif; font-size:clamp(38px,4vw,54px); line-height:1.05; letter-spacing:-2px; }
.project-content > p { position:relative; z-index:2; max-width:440px; margin-top:22px; color:var(--nex4-text-secondary); font-size:16px; line-height:1.75; }
.project-tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:26px; }
.project-tags span { padding:7px 12px; border:1px solid var(--nex4-border); border-radius:999px; color:#8e988f; font-size:12px; }
.project-link { display:inline-flex; align-items:center; gap:10px; margin-top:35px; padding-bottom:5px; border-bottom:1px solid rgba(50,239,69,.4); font-size:14px; font-weight:600; }
.project-link span { color:var(--nex4-green); }
.project-visual { position:relative; padding:30px; overflow:hidden; border-radius:20px; background:radial-gradient(circle at 80% 10%,rgba(50,239,69,.16),transparent 38%),linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px),#061008; background-size:auto,34px 34px,34px 34px,auto; transition:transform .3s ease; }
.project-visual::after { content:""; position:absolute; inset:-60% -20%; background:linear-gradient(105deg,transparent 42%,rgba(255,255,255,.07) 50%,transparent 58%); transform:translateX(-70%); transition:transform .8s ease; pointer-events:none; }
.project-visual:hover::after { transform:translateX(70%); }
.project-visual:hover { transform:translateY(-5px); }
.domain-card { min-height:360px; position:relative; display:flex; flex-direction:column; justify-content:flex-end; overflow:hidden; padding:30px; border:1px solid rgba(255,255,255,.09); border-radius:16px; background:rgba(3,8,4,.78); }
.domain-status { position:absolute; top:24px; left:24px; display:flex; align-items:center; gap:9px; color:var(--nex4-text-secondary); font-size:13px; }
.domain-status i { width:7px; height:7px; border-radius:50%; background:var(--nex4-green); box-shadow:0 0 12px var(--nex4-green); }
.domain-monogram { position:absolute; top:50%; left:50%; transform:translate(-50%,-55%); color:rgba(50,239,69,.08); font-family:"Manrope",sans-serif; font-size:170px; font-weight:800; line-height:1; }
.domain-info span { display:block; margin-bottom:5px; color:var(--nex4-green); font-size:12px; letter-spacing:1.4px; }
.domain-info strong { font-family:"Manrope",sans-serif; font-size:clamp(22px,2.5vw,32px); letter-spacing:-1.2px; }
.domain-arrow { position:absolute; right:30px; bottom:31px; color:var(--nex4-green); font-size:20px; }

@media (max-width:1000px) { .project-card { grid-template-columns:1fr; } }
@media (max-width:850px) { .projects-header { grid-template-columns:1fr; gap:30px; } .project-card { padding:40px; } }
@media (max-width:600px) { .project-card { min-height:auto; gap:40px; padding:38px 18px 18px; } .project-number { top:-35px; font-size:78px; } .project-visual { padding:10px; } .domain-card { min-height:280px; padding:20px; } .domain-monogram { font-size:110px; } .domain-arrow { right:20px; bottom:22px; } .domain-info strong { font-size:20px; } }
</style>
