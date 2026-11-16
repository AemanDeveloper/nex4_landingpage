<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { projects } from "~/data/home";
import ArrowUpRightIcon from "~/components/ui/ArrowUpRightIcon.vue";
import NoiseBackgroundButton from "~/components/ui/NoiseBackgroundButton.vue";

const leadWords = ["We", "build", "digital"];
const tailWords = ["that", "move", "businesses", "forward."];
const rotatingWords = ["products", "websites", "mobile apps", "experiences"];

const hero = ref<HTMLElement>();
const wordElements = ref<HTMLElement[]>([]);
const activeWord = ref(0);
const previousWord = ref(-1);
const rotatorWidth = ref<string>();

let rotateTimer: ReturnType<typeof setInterval> | undefined;
let frame = 0;
let pointer: { x: number; y: number } | undefined;

const setWordElement = (element: unknown, index: number) => {
  if (element instanceof HTMLElement) wordElements.value[index] = element;
};

const measureWord = () => {
  const element = wordElements.value[activeWord.value];
  if (element) rotatorWidth.value = `${Math.ceil(element.getBoundingClientRect().width) + 2}px`;
};

const paint = () => {
  frame = 0;
  const element = hero.value;
  if (!element) return;

  const rect = element.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.8)));
  element.style.setProperty("--hero-scroll", progress.toFixed(3));

  if (pointer) {
    element.style.setProperty("--px", `${pointer.x - rect.left}px`);
    element.style.setProperty("--py", `${pointer.y - rect.top}px`);
  }
};

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(paint);
};

const onPointerMove = (event: PointerEvent) => {
  pointer = { x: event.clientX, y: event.clientY };
  hero.value?.classList.add("has-pointer");
  schedule();
};

onMounted(() => {
  measureWord();
  document.fonts?.ready.then(measureWord);
  window.addEventListener("resize", measureWord);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  rotateTimer = setInterval(() => {
    previousWord.value = activeWord.value;
    activeWord.value = (activeWord.value + 1) % rotatingWords.length;
    measureWord();
  }, 2600);

  window.addEventListener("scroll", schedule, { passive: true });
  if (window.matchMedia("(hover: hover)").matches) {
    hero.value?.addEventListener("pointermove", onPointerMove);
  }
});

onBeforeUnmount(() => {
  clearInterval(rotateTimer);
  cancelAnimationFrame(frame);
  window.removeEventListener("resize", measureWord);
  window.removeEventListener("scroll", schedule);
  hero.value?.removeEventListener("pointermove", onPointerMove);
});
</script>

<template>
  <section id="home" ref="hero" class="hero">
    <div class="background-grid" aria-hidden="true" />
    <div class="grid-torch" aria-hidden="true" />
    <div class="aurora" aria-hidden="true">
      <div class="aurora-layer" />
      <div class="aurora-glow" />
    </div>
    <div class="hero-orbit" aria-hidden="true"><i /><i /><i /></div>
    <div class="hero-shapes" aria-hidden="true">
      <svg class="shape shape--plus" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" /></svg>
      <svg class="shape shape--ring" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /></svg>
      <svg class="shape shape--tri" viewBox="0 0 24 24"><path d="M12 3 22 20H2Z" /></svg>
      <svg class="shape shape--wave" viewBox="0 0 60 16"><path pathLength="1" d="M2 8c7-9 7 9 14 0s7 9 14 0 7 9 14 0 7 9 14 0" /></svg>
      <svg class="shape shape--square" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" /></svg>
      <svg class="shape shape--star" viewBox="0 0 40 40"><path d="M20 0c2 12 6 16 20 20-14 4-18 8-20 20-2-12-6-16-20-20C14 16 18 12 20 0Z" /></svg>
    </div>

    <div class="container hero-container">
      <div class="hero-content">
        <div class="eyebrow"><span /> NEX4 DIGITAL STUDIO</div>

        <h1 aria-label="We build digital products that move businesses forward.">
          <span class="headline-line" aria-hidden="true">
            <span
              v-for="(word, index) in leadWords"
              :key="word"
              class="word"
              :style="{ '--i': index }"
            >{{ word }}</span>
            <span class="rotator word" :style="{ '--i': leadWords.length, width: rotatorWidth }">
              <span
                v-for="(word, index) in rotatingWords"
                :key="word"
                :ref="(element) => setWordElement(element, index)"
                class="rotator-word"
                :class="{ 'is-active': index === activeWord, 'is-leaving': index === previousWord }"
              >{{ word }}</span>
              <svg :key="activeWord" class="scribble" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path pathLength="1" d="M1 6 C 14 1, 24 9, 38 5 S 62 1, 76 6 92 7, 99 3" />
              </svg>
            </span>
          </span>
          <span class="headline-line" aria-hidden="true">
            <span
              v-for="(word, index) in tailWords"
              :key="word"
              class="word"
              :style="{ '--i': leadWords.length + 1 + index }"
            >{{ word }}</span>
          </span>
        </h1>

        <p class="hero-lead">
          Websites, mobile applications and digital marketing brought together
          by one creative technology team.
        </p>

        <div class="hero-actions">
          <NoiseBackgroundButton href="#contact" label="Start a Project" data-magnetic />
          <a href="#work" class="secondary-button" data-magnetic>View Our Work</a>
        </div>

        <div class="project-signals" aria-label="NEX4 products">
          <component
            :is="project.link ? 'a' : 'div'"
            v-for="(project, index) in projects"
            :key="project.title"
            class="signal"
            :class="`signal--${project.tone}`"
            :style="{ '--i': index, '--p': project.theme.accent, '--p-rgb': project.theme.rgb, '--p-alt': project.theme.alt }"
            v-bind="project.link ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' } : {}"
          >
            <span class="signal-status"><i />{{ project.signal }}</span>
            <strong>{{ project.shortTitle }}</strong>
            <ArrowUpRightIcon v-if="project.link" />
          </component>
        </div>
      </div>
    </div>

    <div class="hero-services" aria-label="NEX4 services">
      <div class="services-track">
        <div v-for="copy in 2" :key="copy" class="services-row" :aria-hidden="copy === 2">
          <span>Web Development</span><i /><span>Mobile Applications</span><i />
          <span>AI Integration</span><i /><span>Digital Marketing</span><i />
          <span>Digital Products</span><i />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  --hero-scroll: 0;
  --px: 50%;
  --py: 30%;
  position: relative;
  min-height: max(760px, 100svh);
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 150px 0 120px;
  background: #000;
}
.background-grid,
.grid-torch {
  position: absolute;
  inset: -64px;
  background-size: 64px 64px;
  animation: grid-drift 18s linear infinite;
}
.background-grid {
  opacity: 0.55;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 20%, black 82%, transparent);
}
/* A brighter gold grid that is only revealed in a circle around the cursor. */
.grid-torch {
  opacity: 0;
  background-image:
    linear-gradient(rgba(221, 168, 18, 0.34) 1px, transparent 1px),
    linear-gradient(90deg, rgba(221, 168, 18, 0.34) 1px, transparent 1px);
  mask-image: radial-gradient(260px circle at calc(var(--px) + 64px) calc(var(--py) + 64px), black, transparent 72%);
  transition: opacity 0.6s ease;
}
.hero.has-pointer .grid-torch {
  opacity: 1;
}
.aurora {
  position: absolute;
  z-index: 1;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, black 0%, black 72%, transparent 100%);
  transform: translateY(calc(var(--hero-scroll) * 90px));
}
.aurora-layer {
  position: absolute;
  inset: -45%;
  opacity: 0;
  background-image:
    repeating-linear-gradient(100deg, #000 0%, #000 7%, transparent 10%, transparent 12%, #000 16%),
    repeating-linear-gradient(100deg, #dda812 10%, #7c8cf8 15%, #fff1b8 20%, #3b82f6 25%, #f2c94c 30%);
  background-size:
    300% 220%,
    200% 180%;
  background-position:
    50% 50%,
    50% 50%;
  filter: blur(36px) saturate(1.2);
  transform: rotate(-8deg) scale(1.12);
  mix-blend-mode: screen;
  animation:
    aurora-enter 1.4s 0.05s var(--motion-ease) forwards,
    aurora-shift 60s 1.4s linear infinite;
}
.aurora-layer::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 15%, rgba(221, 168, 18, 0.3), rgba(5, 7, 12, 0) 55%);
}
.aurora-glow {
  position: absolute;
  top: -18%;
  left: 50%;
  width: min(1040px, 120vw);
  height: 700px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(221, 168, 18, 0.15), rgba(96, 165, 250, 0.08) 45%, transparent 72%);
  filter: blur(45px);
  animation: soft-pulse 9s ease-in-out infinite;
}
/* Three thin rings turning slowly behind the headline. */
.hero-orbit {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: min(1180px, 150vw);
  aspect-ratio: 1;
  transform: translate(-50%, -46%) scale(calc(1 + var(--hero-scroll) * 0.25));
  opacity: calc(0.9 - var(--hero-scroll));
  pointer-events: none;
  mask-image: radial-gradient(circle, black 30%, transparent 68%);
}
.hero-orbit i {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 255, 255, 0.055);
  border-radius: 50%;
  animation: orbit-turn 46s linear infinite;
}
.hero-orbit i:nth-child(2) {
  inset: 14%;
  border-style: dashed;
  border-color: rgba(221, 168, 18, 0.16);
  animation-duration: 70s;
  animation-direction: reverse;
}
.hero-orbit i:nth-child(3) {
  inset: 28%;
  animation-duration: 34s;
}
.hero-orbit i::after {
  content: "";
  position: absolute;
  top: 50%;
  left: -4px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--nex4-gold);
  box-shadow: 0 0 16px 3px rgba(221, 168, 18, 0.7);
}
.hero-orbit i:nth-child(2)::after {
  top: 14%;
  left: 14%;
  background: var(--nex4-cream);
  box-shadow: 0 0 14px 2px rgba(250, 247, 240, 0.5);
}
/* Small drawn shapes drifting at the edges, like marks on a motion designer's canvas. */
.hero-shapes {
  position: absolute;
  z-index: 1;
  inset: 0;
  pointer-events: none;
  opacity: calc(1 - var(--hero-scroll) * 1.4);
}
.shape {
  position: absolute;
  width: 34px;
  fill: none;
  stroke: var(--nex4-gold);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  overflow: visible;
  opacity: 0.75;
  animation: shape-drift 9s ease-in-out infinite;
}
.shape--plus { top: 24%; left: 7%; animation-name: shape-spin-drift; animation-duration: 14s; }
.shape--ring { top: 66%; left: 11%; width: 26px; stroke: var(--nex4-cream); opacity: 0.4; animation-delay: -3s; }
.shape--tri { top: 30%; right: 8%; width: 30px; stroke: var(--nex4-coral); animation-name: shape-spin-drift; animation-duration: 18s; animation-direction: reverse; }
.shape--wave { top: 72%; right: 9%; width: 86px; stroke-dasharray: 1; animation: wave-draw 5s var(--motion-ease) infinite alternate; }
.shape--square { top: 16%; right: 22%; width: 20px; stroke: #7c8cf8; opacity: 0.5; animation-delay: -5s; }
.shape--star { top: 58%; left: 22%; width: 22px; fill: var(--nex4-gold); stroke: none; animation: star-twinkle 3.4s ease-in-out infinite; }
.scribble {
  position: absolute;
  left: 2%;
  bottom: 0.02em;
  width: 96%;
  height: 0.16em;
  overflow: visible;
}
.scribble path {
  fill: none;
  stroke: var(--nex4-gold);
  stroke-width: 3;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1;
  animation: scribble-draw 0.9s 0.35s var(--motion-ease) backwards;
}
@keyframes scribble-draw {
  from { stroke-dashoffset: 1; }
}
@keyframes shape-drift {
  50% { translate: 0 -22px; rotate: 12deg; }
}
@keyframes shape-spin-drift {
  50% { translate: 14px -18px; }
  to { rotate: 1turn; }
}
@keyframes wave-draw {
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
}
@keyframes star-twinkle {
  0%, 100% { scale: 0.4; opacity: 0.2; rotate: 0deg; }
  50% { scale: 1.2; opacity: 1; rotate: 90deg; }
}
.hero-container {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  transform: translateY(calc(var(--hero-scroll) * -50px)) scale(calc(1 - var(--hero-scroll) * 0.07));
  opacity: calc(1 - var(--hero-scroll) * 1.15);
}
.hero-content {
  width: min(100%, 1200px);
  padding-top: 110px;
  text-align: center;
}
.eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
  color: var(--nex4-text-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  animation: rise-in 0.9s 0.15s both var(--motion-ease);
}
.eyebrow span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--nex4-green);
  box-shadow: 0 0 14px rgba(221, 168, 18, 0.8);
  animation: status-pulse 2.2s ease-in-out infinite;
}
h1 {
  margin: 0 auto;
  font-family: "Manrope", sans-serif;
  font-size: clamp(54px, 5.6vw, 84px);
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: -0.06em;
}
.headline-line {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 0.2em;
}
.word {
  display: inline-block;
  animation: word-in 1s both var(--motion-ease);
  animation-delay: calc(0.25s + var(--i) * 80ms);
}
.rotator {
  position: relative;
  display: inline-grid;
  overflow: hidden;
  /* Room for descenders so the clipped box does not cut "p". */
  padding: 0.16em 0.06em;
  margin: -0.16em -0.06em;
  text-align: left;
  transition: width 0.7s var(--motion-ease);
}
.rotator-word {
  grid-area: 1 / 1;
  justify-self: start;
  white-space: nowrap;
  color: transparent;
  background: var(--nex4-gradient);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  opacity: 0;
  transform: translateY(105%) rotateX(-70deg);
  transform-origin: 50% 0;
  transition:
    transform 0.75s var(--motion-ease),
    opacity 0.5s ease;
  animation: gradient-slide 5s ease-in-out infinite alternate;
}
.rotator-word.is-active {
  opacity: 1;
  transform: none;
}
.rotator-word.is-leaving {
  transform: translateY(-105%) rotateX(70deg);
  transform-origin: 50% 100%;
}
.hero-lead {
  max-width: 650px;
  margin: 28px auto 0;
  color: var(--nex4-text-secondary);
  font-size: 17px;
  line-height: 1.75;
  animation: rise-in 1s 0.95s both var(--motion-ease);
}
.hero-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 34px;
  animation: rise-in 1s 1.1s both var(--motion-ease);
}
.project-signals {
  width: min(100%, 940px);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 30px auto 0;
}
.signal {
  position: relative;
  z-index: 0;
  min-width: 0;
  min-height: 58px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  overflow: hidden;
  border-radius: 12px;
  color: var(--nex4-text);
  text-align: left;
  background: rgba(4, 6, 10, 0.82);
  animation: rise-in 0.9s both var(--motion-ease);
  animation-delay: calc(1.25s + var(--i) * 90ms);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}
.signal::before {
  content: "";
  position: absolute;
  z-index: -2;
  inset: -220%;
  background: conic-gradient(
    from 0deg,
    transparent 0 76%,
    rgba(var(--p-rgb), 0.12) 82%,
    var(--p) 90%,
    var(--p-alt) 94%,
    transparent 100%
  );
  animation: moving-border 3.4s linear infinite;
  animation-delay: calc(var(--i) * -0.85s);
}
.signal::after {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 1px;
  border-radius: 12px;
  background: rgba(4, 6, 10, 0.92);
}
a.signal:hover,
a.signal:focus-visible {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(var(--p-rgb), 0.2);
  outline: none;
}
.signal strong {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
}
.signal > :deep(svg) {
  color: var(--p);
  font-size: 15px;
  transition: transform var(--motion-fast) var(--motion-ease);
}
a.signal:hover > :deep(svg) {
  transform: translate(2px, -2px);
}
.signal-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--nex4-text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  white-space: nowrap;
}
.signal-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--nex4-green);
  box-shadow: 0 0 9px rgba(221, 168, 18, 0.75);
  animation: status-pulse 1.8s ease-in-out infinite;
}
.signal--live .signal-status i {
  background: #32ef45;
  box-shadow: 0 0 9px rgba(50, 239, 69, 0.75);
}
.signal--new .signal-status {
  color: var(--nex4-coral);
}
.signal--new .signal-status i {
  background: var(--nex4-coral);
  box-shadow: 0 0 10px rgba(241, 118, 86, 0.8);
}
/* A closed product keeps its place in the row but stops moving. */
.signal--closed {
  grid-template-columns: auto 1fr;
  color: var(--nex4-text-muted);
}
.signal--closed::before {
  inset: 0;
  background: rgba(255, 255, 255, 0.09);
  animation: none;
}
.signal--closed .signal-status i {
  background: #6b7280;
  box-shadow: none;
  animation: none;
}
.hero-services {
  position: absolute;
  z-index: 3;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  border-top: 1px solid var(--nex4-border);
  background: rgba(255, 255, 255, 0.01);
  mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
}
.services-track {
  display: flex;
  width: max-content;
  animation: services-marquee 25s linear infinite;
}
.hero-services:hover .services-track {
  animation-play-state: paused;
}
.services-row {
  min-height: 65px;
  display: flex;
  align-items: center;
  gap: 54px;
  padding-right: 54px;
  color: var(--nex4-text-muted);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
}
.services-row span {
  transition: color 0.3s ease;
}
.services-row span:hover {
  color: var(--nex4-gold);
}
.services-row i {
  width: 4px;
  height: 4px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--nex4-green);
}

@keyframes word-in {
  from {
    opacity: 0;
    filter: blur(14px);
    transform: translateY(0.5em) rotate(3deg);
  }
}
@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
}
@keyframes gradient-slide {
  to {
    background-position: 100% 0;
  }
}
@keyframes orbit-turn {
  to {
    transform: rotate(1turn);
  }
}
@keyframes aurora-enter {
  from {
    opacity: 0;
    transform: rotate(-8deg) scale(0.9);
  }
  to {
    opacity: 0.3;
    transform: rotate(-8deg) scale(1.12);
  }
}
@keyframes aurora-shift {
  from {
    background-position:
      50% 50%,
      50% 50%;
  }
  to {
    background-position:
      350% 50%,
      350% 50%;
  }
}
@keyframes moving-border {
  to {
    transform: rotate(1turn);
  }
}
@keyframes services-marquee {
  to {
    transform: translateX(-50%);
  }
}

@media (max-width: 900px) {
  .project-signals {
    width: min(100%, 520px);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 700px) {
  .hero {
    min-height: max(820px, 100svh);
    padding: 120px 0 105px;
  }
  .aurora-layer {
    inset: -35% -90%;
    filter: blur(28px) saturate(1.1);
  }
  .aurora-glow {
    top: -8%;
    width: 150vw;
    height: 520px;
  }
  .hero-orbit {
    width: 190vw;
  }
  .shape--square,
  .shape--star,
  .shape--ring {
    display: none;
  }
  .shape--plus { top: 13%; left: 6%; width: 22px; }
  .shape--tri { top: 14%; right: 7%; width: 20px; }
  .shape--wave { top: auto; bottom: 86px; right: 6%; width: 54px; }
  .scribble { left: 50%; width: 46%; margin-left: -23%; }
  .hero-content {
    padding-top: 70px;
  }
  .eyebrow {
    margin-bottom: 20px;
    font-size: 11px;
  }
  h1 {
    font-size: clamp(40px, 11.6vw, 52px);
    line-height: 1.05;
  }
  /* The rotating word gets its own centred line so the others never reflow. */
  .rotator {
    width: 100% !important;
    justify-items: center;
  }
  .rotator-word {
    justify-self: center;
  }
  .hero-lead {
    margin-top: 23px;
    font-size: 16px;
    line-height: 1.65;
  }
  .hero-actions {
    flex-direction: column;
    margin-top: 28px;
  }
  .hero-actions a {
    width: 100%;
  }
  .project-signals {
    margin-top: 22px;
    gap: 8px;
  }
  .signal,
  .signal--closed {
    grid-template-columns: 1fr auto;
    gap: 2px 8px;
    padding: 10px 12px;
  }
  .signal-status {
    grid-column: 1 / -1;
    font-size: 9px;
  }
  .signal strong {
    font-size: 13px;
  }
  .services-track {
    animation-duration: 18s;
  }
  .services-row {
    gap: 34px;
    padding-right: 34px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero-container,
  .aurora,
  .hero-orbit {
    transform: none;
    opacity: 1;
  }
  .hero-orbit {
    transform: translate(-50%, -46%);
  }
}
</style>
