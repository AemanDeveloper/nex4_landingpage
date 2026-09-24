<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { projects } from "~/data/home";
import ArrowUpRightIcon from "~/components/ui/ArrowUpRightIcon.vue";

const projectCards = ref<HTMLElement[]>([]);
let frame = 0;

const setProjectCard = (element: unknown, index: number) => {
  if (element instanceof HTMLElement) projectCards.value[index] = element;
};

const updateProjectMotion = () => {
  const viewportHeight = window.innerHeight;

  projectCards.value.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight * 0.72)));
    card.style.setProperty("--card-rotate", `${(1 - progress) * 10}deg`);
    card.style.setProperty("--card-scale", `${0.9 + progress * 0.1}`);
    card.style.setProperty("--card-lift", `${(1 - progress) * 72}px`);
  });
};

const scheduleProjectMotion = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(updateProjectMotion);
};

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  updateProjectMotion();
  window.addEventListener("scroll", scheduleProjectMotion, { passive: true });
  window.addEventListener("resize", scheduleProjectMotion);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  window.removeEventListener("scroll", scheduleProjectMotion);
  window.removeEventListener("resize", scheduleProjectMotion);
});
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
        <div v-for="(project, index) in projects" :key="project.title" class="project-stage">
        <article :ref="(element) => setProjectCard(element, index)" class="project-card">
          <div class="project-content">
            <span class="project-number">{{ project.number }}</span>
            <div class="project-category">{{ project.category }}</div>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-tags"><span v-for="tag in project.tags" :key="tag">{{ tag }}</span></div>
            <a :href="project.link" target="_blank" rel="noopener noreferrer" class="project-link">
              {{ project.linkText }} <ArrowUpRightIcon />
            </a>
          </div>

          <a :href="project.link" target="_blank" rel="noopener noreferrer" class="project-visual" :aria-label="`${project.linkText}: ${project.title}`">
            <div class="domain-card">
              <img
                class="project-preview"
                :src="project.preview"
                :alt="project.previewAlt"
                width="1440"
                height="900"
                loading="lazy"
                decoding="async"
              />
              <div class="domain-status"><i />{{ project.status }}</div>
              <div class="domain-info">
                <span>NEX4 NETWORK</span>
                <strong>{{ project.domain }}</strong>
              </div>
              <span class="domain-arrow" aria-hidden="true"><ArrowUpRightIcon /></span>
            </div>
          </a>
        </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-section { border-top:1px solid var(--nex4-border); background:#050805; }
.projects-header { display:grid; grid-template-columns:1fr 400px; align-items:end; gap:60px; margin-bottom:70px; }
.projects-header > p { color:var(--nex4-text-secondary); font-size:16px; line-height:1.8; }
.projects-list { display:grid; gap:55px; perspective:1200px; }
.project-stage { perspective:1200px; transform-style:preserve-3d; }
.project-card { --card-rotate:10deg; --card-scale:.9; --card-lift:72px; min-height:560px; display:grid; grid-template-columns:.88fr 1.12fr; align-items:center; gap:70px; padding:60px; border:1px solid var(--nex4-border); border-radius:24px; background:linear-gradient(145deg,rgba(255,255,255,.035),rgba(255,255,255,.006)); box-shadow:0 45px 100px rgba(0,0,0,.34); transform:translateY(var(--card-lift)) rotateX(var(--card-rotate)) scale(var(--card-scale)); transform-origin:50% 0%; transform-style:preserve-3d; will-change:transform; transition:border-color var(--motion-fast) ease,box-shadow var(--motion-fast) ease; }
.project-card:hover { border-color:rgba(50,239,69,.2); box-shadow:0 35px 100px rgba(0,0,0,.22); }
.project-content { position:relative; }
.project-number { position:absolute; top:-72px; left:-10px; color:rgba(255,255,255,.025); font-family:"Manrope",sans-serif; font-size:120px; font-weight:800; }
.project-category { position:relative; z-index:2; margin-bottom:18px; color:var(--nex4-green); font-size:12px; font-weight:700; letter-spacing:1.6px; }
.project-content h3 { position:relative; z-index:2; font-family:"Manrope",sans-serif; font-size:clamp(38px,4vw,54px); line-height:1.05; letter-spacing:-2px; }
.project-content > p { position:relative; z-index:2; max-width:440px; margin-top:22px; color:var(--nex4-text-secondary); font-size:16px; line-height:1.75; }
.project-tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:26px; }
.project-tags span { padding:7px 12px; border:1px solid var(--nex4-border); border-radius:999px; color:#8e988f; font-size:12px; }
.project-link { display:inline-flex; align-items:center; gap:10px; margin-top:35px; padding-bottom:5px; border-bottom:1px solid rgba(50,239,69,.4); font-size:14px; font-weight:600; }
.project-link :deep(svg) { color:var(--nex4-green); }
.project-visual { position:relative; padding:14px; overflow:hidden; border-radius:20px; background:radial-gradient(circle at 80% 10%,rgba(50,239,69,.16),transparent 38%),linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px),#061008; background-size:auto,34px 34px,34px 34px,auto; transition:transform .3s ease; }
.project-visual::after { content:""; position:absolute; inset:-60% -20%; background:linear-gradient(105deg,transparent 42%,rgba(255,255,255,.07) 50%,transparent 58%); transform:translateX(-70%); transition:transform .8s ease; pointer-events:none; }
.project-visual:hover::after { transform:translateX(70%); }
.project-visual:hover { transform:translateY(-5px); }
.domain-card { min-height:390px; position:relative; display:flex; flex-direction:column; justify-content:flex-end; overflow:hidden; padding:30px; border:1px solid rgba(255,255,255,.09); border-radius:16px; background:#071009; isolation:isolate; }
.domain-card::after { content:""; position:absolute; z-index:1; inset:0; background:linear-gradient(180deg,rgba(2,5,3,.03) 40%,rgba(2,5,3,.9) 100%); pointer-events:none; }
.project-preview { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; transform:scale(1.01); transition:transform .65s cubic-bezier(.2,.7,.2,1),filter .35s ease; }
.project-visual:hover .project-preview { transform:scale(1.045); filter:saturate(1.05); }
.domain-status { position:absolute; z-index:2; top:20px; left:20px; display:flex; align-items:center; gap:9px; padding:8px 11px; border:1px solid rgba(255,255,255,.12); border-radius:999px; background:rgba(3,8,4,.76); color:#e7ece8; font-size:12px; backdrop-filter:blur(10px); }
.domain-status i { width:7px; height:7px; border-radius:50%; background:var(--nex4-green); box-shadow:0 0 12px var(--nex4-green); }
.domain-info { position:relative; z-index:2; }
.domain-info span { display:block; margin-bottom:5px; color:var(--nex4-green); font-size:12px; letter-spacing:1.4px; }
.domain-info strong { color:#fff; font-family:"Manrope",sans-serif; font-size:clamp(22px,2.5vw,30px); letter-spacing:-1.2px; text-shadow:0 2px 20px rgba(0,0,0,.6); }
.domain-arrow { position:absolute; z-index:2; right:30px; bottom:31px; display:grid; place-items:center; width:38px; height:38px; border:1px solid rgba(255,255,255,.14); border-radius:50%; background:rgba(3,8,4,.7); color:var(--nex4-green); font-size:18px; backdrop-filter:blur(10px); }

@media (max-width:1000px) { .project-card { grid-template-columns:1fr; } }
@media (max-width:850px) { .projects-header { grid-template-columns:1fr; gap:30px; } .project-card { padding:40px; } }
@media (max-width:600px) { .projects-list { gap:38px; } .project-card { min-height:auto; gap:40px; padding:38px 18px 18px; } .project-number { top:-35px; font-size:78px; } .project-visual { padding:8px; } .domain-card { min-height:280px; padding:20px; } .domain-status { top:14px; left:14px; } .domain-arrow { right:16px; bottom:18px; width:34px; height:34px; } .domain-info { max-width:calc(100% - 46px); } .domain-info strong { font-size:18px; } }
@media (prefers-reduced-motion:reduce) { .project-card { transform:none; } }
</style>
