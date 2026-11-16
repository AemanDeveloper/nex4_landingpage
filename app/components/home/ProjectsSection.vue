<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { projects } from "~/data/home";
import ArrowUpRightIcon from "~/components/ui/ArrowUpRightIcon.vue";
import SebingkaiVisual from "~/components/home/SebingkaiVisual.vue";
import ProjectMotif from "~/components/home/ProjectMotif.vue";

const projectCards = ref<HTMLElement[]>([]);
let frame = 0;
let mobileObserver: IntersectionObserver | undefined;

const setProjectCard = (element: unknown, index: number) => {
  if (element instanceof HTMLElement) projectCards.value[index] = element;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

// Each card tilts up into place as it enters, then sinks back as the next card slides over it.
const updateProjectMotion = () => {
  const viewportHeight = window.innerHeight;
  const cards = projectCards.value;

  cards.forEach((card, index) => {
    const stage = card.parentElement as HTMLElement;
    const rect = stage.getBoundingClientRect();
    const enter = clamp((viewportHeight - rect.top) / (viewportHeight * 0.72));
    const nextStage = cards[index + 1]?.parentElement;
    const covered = nextStage
      ? clamp(1 - (nextStage.getBoundingClientRect().top - rect.top) / rect.height)
      : 0;

    card.style.setProperty("--card-rotate", `${(1 - enter) * 10}deg`);
    card.style.setProperty("--card-scale", `${(0.9 + enter * 0.1) * (1 - covered * 0.07)}`);
    card.style.setProperty("--card-lift", `${(1 - enter) * 72}px`);
    card.style.setProperty("--card-dim", `${covered * 0.6}`);
  });
};

const scheduleProjectMotion = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(updateProjectMotion);
};

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    projectCards.value.forEach((card) => card.classList.add("is-mobile-visible"));
    return;
  }

  if (window.matchMedia("(max-width: 700px)").matches) {
    mobileObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-mobile-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    projectCards.value.forEach((card) => mobileObserver?.observe(card));
    return;
  }

  updateProjectMotion();
  window.addEventListener("scroll", scheduleProjectMotion, { passive: true });
  window.addEventListener("resize", scheduleProjectMotion);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  mobileObserver?.disconnect();
  window.removeEventListener("scroll", scheduleProjectMotion);
  window.removeEventListener("resize", scheduleProjectMotion);
});
</script>

<template>
  <section id="work" class="section projects-section">
    <div class="container">
      <div class="projects-header">
        <div>
          <div class="section-label" data-reveal>02 / SELECTED WORK</div>
          <h2 class="section-title" data-reveal="mask">Products in the <br /><span>NEX4 network.</span></h2>
        </div>
        <p data-reveal style="--reveal-delay: 120ms">Digital products built and maintained by the NEX4 team.</p>
      </div>

      <div class="projects-list">
        <div v-for="(project, index) in projects" :key="project.title" class="project-stage" :style="{ '--i': index }">
          <article
            :ref="(element) => setProjectCard(element, index)"
            class="project-card"
            :class="[`project-card--${project.tone}`, `project-card--${project.motif}`]"
            :style="{ '--p': project.theme.accent, '--p-rgb': project.theme.rgb, '--p-alt': project.theme.alt }"
            data-spotlight
          >
            <div class="project-content">
              <span class="project-number">{{ String(index + 1).padStart(2, "0") }}</span>
              <div class="project-category">
                {{ project.category }}
                <span v-if="project.tone === 'new'" class="new-badge">New</span>
              </div>
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-tags"><span v-for="tag in project.tags" :key="tag">{{ tag }}</span></div>
              <ProjectMotif :kind="project.motif" />
              <a
                :href="project.link ?? '#contact'"
                class="project-link"
                v-bind="project.link ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
              >
                <span class="link-circle" aria-hidden="true"><span class="link-arrow" /></span>
                <span class="link-text">{{ project.linkText }}</span>
              </a>
            </div>

            <component
              :is="project.link ? 'a' : 'div'"
              class="project-visual"
              v-bind="project.link ? { href: project.link, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${project.linkText}: ${project.title}` } : {}"
            >
              <div class="domain-card">
                <img
                  v-if="project.preview"
                  class="project-preview"
                  :src="project.preview"
                  :alt="project.previewAlt"
                  width="1440"
                  height="900"
                  loading="lazy"
                  decoding="async"
                />
                <SebingkaiVisual v-else />
                <div class="domain-status"><i />{{ project.status }}</div>
                <div class="domain-info">
                  <span>NEX4 NETWORK</span>
                  <strong>{{ project.domain }}</strong>
                </div>
                <span v-if="project.link" class="domain-arrow" aria-hidden="true"><ArrowUpRightIcon /></span>
              </div>
            </component>

            <div class="card-dim" aria-hidden="true" />
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-section { border-top:1px solid var(--nex4-border); background:#05070d; }
.projects-header { display:grid; grid-template-columns:1fr 400px; align-items:end; gap:60px; margin-bottom:70px; }
.projects-header > p { color:var(--nex4-text-secondary); font-size:16px; line-height:1.8; }
.projects-list { display:grid; grid-template-columns:minmax(0,1fr); gap:55px; perspective:1200px; }
.project-content,.project-visual { min-width:0; }
.card-dim { position:absolute; z-index:5; inset:0; border-radius:inherit; background:#03050a; opacity:var(--card-dim); pointer-events:none; }
.project-stage { perspective:1200px; transform-style:preserve-3d; }
.project-card { --card-rotate:10deg; --card-scale:.9; --card-lift:72px; --card-dim:0; position:relative; min-height:540px; display:grid; grid-template-columns:.88fr 1.12fr; align-items:center; gap:70px; padding:60px; border:1px solid var(--nex4-border); border-radius:24px; background:radial-gradient(circle at 0 0,rgba(var(--p-rgb),.13),transparent 46%),radial-gradient(circle at 100% 100%,rgba(var(--p-rgb),.07),transparent 40%),linear-gradient(145deg,#10141f,#07090f); box-shadow:0 45px 100px rgba(0,0,0,.34); transform:translateY(var(--card-lift)) rotateX(var(--card-rotate)) scale(var(--card-scale)); transform-origin:50% 0%; transform-style:preserve-3d; will-change:transform; transition:border-color var(--motion-fast) ease,box-shadow var(--motion-fast) ease; }
.project-card:hover { border-color:rgba(var(--p-rgb),.4); box-shadow:0 35px 100px rgba(0,0,0,.22); }
.project-content { position:relative; z-index:1; }
.project-visual { z-index:1; }
.project-number { position:absolute; top:-72px; left:-10px; color:rgba(255,255,255,.025); font-family:"Manrope",sans-serif; font-size:120px; font-weight:800; }
.project-category { position:relative; z-index:2; display:flex; align-items:center; gap:10px; margin-bottom:18px; color:var(--p); font-size:12px; font-weight:700; letter-spacing:1.6px; }
.project-content h3 { position:relative; z-index:2; font-family:"Manrope",sans-serif; font-size:clamp(38px,4vw,54px); line-height:1.05; letter-spacing:-2px; }
.project-content > p { position:relative; z-index:2; max-width:440px; margin-top:22px; color:var(--nex4-text-secondary); font-size:16px; line-height:1.75; }
.project-tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:26px; }
.project-tags span { padding:7px 12px; border:1px solid rgba(var(--p-rgb),.22); border-radius:999px; color:#9da4b1; font-size:12px; }
.project-link { position:relative; width:13.5rem; height:3rem; display:inline-block; margin-top:35px; border:0; color:inherit; font-size:13px; font-weight:700; outline:none; }
.link-circle { position:relative; width:3rem; height:3rem; display:block; margin:0; border:1px solid rgba(var(--p-rgb),.5); border-radius:1.625rem; background:#171b27; transition:all .45s cubic-bezier(.65,0,.076,1); }
.link-arrow { position:absolute; top:0; bottom:0; left:.625rem; width:1.125rem; height:.125rem; margin:auto; background:transparent; transition:all .45s cubic-bezier(.65,0,.076,1); }
.link-arrow::before { position:absolute; content:""; top:-.29rem; right:.0625rem; width:.625rem; height:.625rem; border-top:.125rem solid var(--p); border-right:.125rem solid var(--p); transform:rotate(45deg); }
.link-text { position:absolute; inset:0; padding:.75rem 0; margin-left:1.85rem; color:#dce4de; line-height:1.6; text-align:center; text-transform:uppercase; transition:all .45s cubic-bezier(.65,0,.076,1); }
.project-link:hover .link-circle,.project-link:focus-visible .link-circle { width:100%; border-color:var(--p); background:color-mix(in srgb,var(--p) 45%,#05070d); box-shadow:0 12px 34px rgba(var(--p-rgb),.25); }
.project-link:hover .link-arrow,.project-link:focus-visible .link-arrow { background:#fff; transform:translateX(1rem); }
.project-link:hover .link-text,.project-link:focus-visible .link-text { color:#fff; }
.project-link:focus-visible { outline:2px solid var(--p); outline-offset:5px; border-radius:999px; }
.project-visual { position:relative; padding:14px; overflow:hidden; border-radius:20px; background:radial-gradient(circle at 80% 10%,rgba(var(--p-rgb),.3),transparent 42%),linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px),#08101d; background-size:auto,34px 34px,34px 34px,auto; transition:transform .3s ease; }
.project-visual::after { content:""; position:absolute; inset:-60% -20%; background:linear-gradient(105deg,transparent 42%,rgba(255,255,255,.07) 50%,transparent 58%); transform:translateX(-70%); transition:transform .8s ease; pointer-events:none; }
.project-visual:hover::after { transform:translateX(70%); }
.project-visual:hover { transform:translateY(-5px); }
.domain-card { min-height:390px; position:relative; display:flex; flex-direction:column; justify-content:flex-end; overflow:hidden; padding:30px; border:1px solid rgba(255,255,255,.09); border-radius:16px; background:#080d18; isolation:isolate; }
.domain-card::after { content:""; position:absolute; z-index:1; inset:0; background:linear-gradient(180deg,rgba(5,8,16,.03) 40%,rgba(5,8,16,.92) 100%); pointer-events:none; }
.project-preview { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; transform:scale(1.01); transition:transform .65s cubic-bezier(.2,.7,.2,1),filter .35s ease; }
.project-visual:hover .project-preview { transform:scale(1.045); filter:saturate(1.05); }
.domain-status { position:absolute; z-index:2; top:20px; left:20px; display:flex; align-items:center; gap:9px; padding:8px 11px; border:1px solid rgba(255,255,255,.12); border-radius:999px; background:rgba(5,8,16,.8); color:#f2efe8; font-size:12px; backdrop-filter:blur(10px); }
.domain-status i { width:7px; height:7px; border-radius:50%; background:var(--nex4-green); box-shadow:0 0 12px var(--nex4-green); animation:status-pulse 1.8s ease-in-out infinite; }
.project-card--live .domain-status i { background:#32ef45; box-shadow:0 0 12px #32ef45; }
.project-card--new .domain-status i { background:var(--nex4-coral); box-shadow:0 0 12px var(--nex4-coral); }
.new-badge { padding:3px 9px; border-radius:999px; background:var(--p); color:#190905; font-size:10px; letter-spacing:1px; text-transform:uppercase; animation:badge-pop 2.4s var(--motion-ease) infinite; }
@keyframes badge-pop { 0%,100% { box-shadow:0 0 0 0 rgba(241,118,86,.55); } 60% { box-shadow:0 0 0 9px rgba(241,118,86,0); } }
/* Per-project character: the glow, edge light and tag shape follow the product. */
.project-card[data-spotlight]::before { background:radial-gradient(460px circle at var(--mx,50%) var(--my,50%),rgba(var(--p-rgb),.16),transparent 62%); }
.project-card::after { content:""; position:absolute; z-index:1; inset:0 14% auto; height:1px; background:linear-gradient(90deg,transparent,var(--p),transparent); opacity:.7; }
.project-number { color:rgba(var(--p-rgb),.07) !important; }
.project-tags span { transition:border-color .25s ease,color .25s ease,background .25s ease; }
.project-tags span:hover { border-color:var(--p); background:rgba(var(--p-rgb),.1); color:#fff; }
.project-card--nutrition h3 { font-weight:800; }
.project-card--pipeline .project-tags span { border-radius:7px; }
.project-card--film .project-tags span { border-radius:3px; border-style:dashed; }
.project-card--film h3 { font-style:italic; letter-spacing:-3px; }
.project-card--lessons .project-tags span { border-radius:10px; }
.project-card--lessons .domain-info span { color:var(--nex4-text-muted); }
/* A closed product: the preview goes quiet and nothing links out. */
.project-card--closed .project-preview { filter:grayscale(1) brightness(.5); }
.project-card--closed .domain-status { border-color:rgba(255,255,255,.2); color:#c5cad3; }
.project-card--closed .domain-status i { background:#6b7280; box-shadow:none; animation:none; }
.project-card--closed .domain-info span { color:var(--nex4-text-muted); }
.project-card--closed .domain-info strong { color:#aeb4c0; text-decoration:line-through; text-decoration-color:rgba(221,168,18,.7); text-decoration-thickness:2px; }
.project-card--closed .project-visual::after { display:none; }
.project-card--closed .project-visual:hover,.project-card--closed .project-visual:hover .project-preview { transform:none; filter:grayscale(1) brightness(.5); }
.project-card--closed .project-visual:hover { filter:none; }
.domain-info { position:relative; z-index:2; }
.domain-info span { display:block; margin-bottom:5px; color:var(--p); font-size:12px; letter-spacing:1.4px; }
.domain-info strong { color:#fff; font-family:"Manrope",sans-serif; font-size:clamp(22px,2.5vw,30px); letter-spacing:-1.2px; text-shadow:0 2px 20px rgba(0,0,0,.6); }
.domain-arrow { position:absolute; z-index:2; right:30px; bottom:31px; display:grid; place-items:center; width:38px; height:38px; border:1px solid rgba(255,255,255,.14); border-radius:50%; background:rgba(5,8,16,.76); color:var(--p); font-size:18px; backdrop-filter:blur(10px); }

/* Roomy screens: cards pin under the navbar and stack like a deck while you scroll. */
@media (min-width:1001px) and (min-height:740px) { .projects-list { gap:90px; } .project-stage { position:sticky; top:calc(100px + var(--i) * 14px); } }
@media (max-width:1000px) { .project-card { grid-template-columns:1fr; } }
@media (max-width:850px) { .projects-header { grid-template-columns:1fr; gap:30px; } .project-card { padding:40px; } }
@media (max-width:600px) { .projects-list { gap:46px; } .project-stage { overflow:visible; } .project-card { min-height:auto; gap:40px; padding:38px 18px 18px; opacity:.15; transform:translateY(54px) rotateX(7deg) scale(.94); transform-origin:50% 20%; transition:transform .85s var(--motion-ease),opacity .65s ease,border-color var(--motion-fast) ease,box-shadow var(--motion-fast) ease; } .project-card.is-mobile-visible { opacity:1; transform:translateY(0) rotateX(0) scale(1); } .project-number { top:-35px; font-size:78px; } .project-visual { padding:8px; } .domain-card { min-height:280px; padding:20px; } .domain-status { top:14px; left:14px; } .domain-arrow { right:16px; bottom:18px; width:34px; height:34px; } .domain-info { max-width:calc(100% - 46px); } .domain-info strong { font-size:18px; } }
@media (prefers-reduced-motion:reduce) { .project-card { opacity:1; transform:none; } }
</style>
