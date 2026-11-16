<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { projects, services, team } from "~/data/home";

const leadWords =
  "NEX4 is an independent digital team bringing development and marketing together.".split(" ");

const values = [
  { title: "Build with purpose.", text: "Every product should solve a real problem." },
  { title: "Keep it practical.", text: "Technology should make things easier, not harder." },
  { title: "Create together.", text: "Development and marketing work better together." },
];

const stats = [
  { value: projects.length, label: "Products in the network" },
  { value: services.length, label: "Core services" },
  { value: team.length, label: "People, one team" },
];

const lead = ref<HTMLElement>();
const statsRow = ref<HTMLElement>();
const counts = ref(stats.map((stat) => stat.value));

let frame = 0;
let statsObserver: IntersectionObserver | undefined;

// Words in the lead sentence light up one by one as it travels up the screen.
const paintLead = () => {
  frame = 0;
  const element = lead.value;
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const viewport = window.innerHeight;
  const progress = (viewport * 0.88 - rect.top) / (viewport * 0.5);
  element.style.setProperty("--lead-progress", Math.min(1, Math.max(0, progress)).toFixed(3));
};

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(paintLead);
};

const countUp = () => {
  const startedAt = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - startedAt) / 1400);
    const eased = 1 - Math.pow(1 - t, 3);
    counts.value = stats.map((stat) => Math.round(stat.value * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  lead.value?.classList.add("is-scroll-lit");
  paintLead();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  counts.value = stats.map(() => 0);
  statsObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      countUp();
    },
    { threshold: 0.4 },
  );
  if (statsRow.value) statsObserver.observe(statsRow.value);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  statsObserver?.disconnect();
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
});
</script>

<template>
  <section id="about" class="section about-section">
    <div class="about-glow" />

    <div class="container about-layout">
      <div class="about-heading">
        <div class="section-label" data-reveal>03 / ABOUT NEX4</div>

        <h2 class="section-title" data-reveal="mask">
          Small team.
          <br />
          <span>Big ideas.</span>
        </h2>

        <div ref="statsRow" class="about-stats" data-reveal style="--reveal-delay: 150ms">
          <div v-for="(stat, index) in stats" :key="stat.label">
            <strong>{{ String(counts[index]).padStart(2, "0") }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <div class="about-content">
        <p
          ref="lead"
          class="about-lead"
          :style="{ '--word-count': leadWords.length }"
          :aria-label="leadWords.join(' ')"
        >
          <span v-for="(word, index) in leadWords" :key="index" aria-hidden="true" :style="{ '--i': index }">{{ `${word} ` }}</span>
        </p>

        <p data-reveal>
          We help businesses turn ideas into digital experiences — from websites
          and mobile applications to digital products and marketing strategies
          built around real business needs.
        </p>

        <p data-reveal>
          We believe good digital products do not need unnecessary complexity.
          They need clear ideas, strong execution and the right strategy.
        </p>

        <div class="about-values">
          <article
            v-for="(value, index) in values"
            :key="value.title"
            data-reveal
            :style="{ '--reveal-delay': `${index * 110}ms` }"
          >
            <span>0{{ index + 1 }}</span>

            <div>
              <strong>{{ value.title }}</strong>

              <p>{{ value.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  position: relative;

  overflow: hidden;

  border-top: 1px solid var(--nex4-border);

  background:
    radial-gradient(
      circle at 10% 50%,
      rgba(221, 168, 18, 0.06),
      transparent 32%
    ),
    var(--nex4-bg);
}

.about-layout {
  position: relative;

  z-index: 2;

  display: grid;

  grid-template-columns: 0.9fr 1.1fr;

  gap: 120px;
}

.about-content {
  max-width: 650px;
}

.about-content > p {
  margin-bottom: 22px;

  color: var(--nex4-text-secondary);

  font-size: 15px;

  line-height: 1.9;
}

.about-content .about-lead {
  color: var(--nex4-text);

  font-family: "Manrope", sans-serif;

  font-size: 23px;

  line-height: 1.6;

  letter-spacing: -0.6px;

  font-size: clamp(22px, 2.3vw, 30px);

  line-height: 1.4;
}

/* Each word waits for the scroll progress to reach its position in the sentence. */
.about-lead.is-scroll-lit span {
  opacity: clamp(0.16, calc(var(--lead-progress, 1) * (var(--word-count) + 3) - var(--i)), 1);

  transition: opacity 0.25s linear;
}

.about-heading {
  align-self: start;

  position: sticky;

  top: 130px;
}

.about-stats {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 18px;

  max-width: 460px;

  margin-top: 54px;

  padding-top: 26px;

  border-top: 1px solid var(--nex4-border);
}

.about-stats strong {
  display: block;

  color: transparent;

  background: var(--nex4-gradient);

  background-clip: text;

  -webkit-background-clip: text;

  font-family: "Manrope", sans-serif;

  font-size: clamp(34px, 3.4vw, 48px);

  font-weight: 700;

  line-height: 1.1;

  letter-spacing: -2px;

  font-variant-numeric: tabular-nums;
}

.about-stats span {
  display: block;

  margin-top: 6px;

  color: var(--nex4-text-muted);

  font-size: 12px;

  line-height: 1.45;
}

.about-values {
  display: grid;

  gap: 0;

  margin-top: 50px;

  border-top: 1px solid var(--nex4-border);
}

.about-values article {
  display: grid;

  grid-template-columns: 55px 1fr;

  gap: 20px;

  padding: 23px 0;

  border-bottom: 1px solid var(--nex4-border);

  position: relative;

  transition: padding-left var(--motion-medium) var(--motion-ease);
}

.about-values article::after {
  content: "";

  position: absolute;

  left: 0;
  bottom: -1px;

  width: 100%;
  height: 1px;

  background: var(--nex4-gradient);

  transform: scaleX(0);

  transform-origin: left;

  transition: transform var(--motion-slow) var(--motion-ease);
}

.about-values article:hover {
  padding-left: 14px;
}

.about-values article:hover::after {
  transform: scaleX(1);
}

.about-values article > span {
  color: var(--nex4-green);

  font-size: 12px;

  font-weight: 600;
}

.about-values strong {
  display: block;

  margin-bottom: 5px;

  font-family: "Manrope", sans-serif;

  font-size: 15px;

  font-weight: 600;
}

.about-values p {
  color: var(--nex4-text-muted);

  font-size: 14px;
}

.about-glow {
  position: absolute;

  width: 450px;
  height: 450px;

  top: 40%;
  left: -300px;

  border-radius: 50%;

  background: rgba(221, 168, 18, 0.09);

  filter: blur(130px);
}

@media (max-width: 900px) {
  .about-layout {
    grid-template-columns: 1fr;

    gap: 55px;
  }

  .about-heading {
    position: static;
  }
}

@media (max-width: 600px) {
  .about-content .about-lead {
    font-size: 20px;
  }
}
</style>
