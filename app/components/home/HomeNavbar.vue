<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import ArrowUpRightIcon from "~/components/ui/ArrowUpRightIcon.vue";

const links = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "team", label: "Team" },
];

const menuOpen = ref(false);
const scrolled = ref(false);
const activeId = ref("");
const progress = ref(0);
const indicator = ref({ left: 0, width: 0, visible: false });
const linkElements = ref<Record<string, HTMLElement>>({});

let frame = 0;
let spy: IntersectionObserver | undefined;

const closeMenu = () => (menuOpen.value = false);
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") closeMenu();
};

const setLink = (element: unknown, id: string) => {
  if (element instanceof HTMLElement) linkElements.value[id] = element;
};

const moveIndicator = () => {
  const element = linkElements.value[activeId.value];
  indicator.value = element
    ? { left: element.offsetLeft, width: element.offsetWidth, visible: true }
    : { ...indicator.value, visible: false };
};

const onScroll = () => {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    scrolled.value = window.scrollY > 40;
  });
};

watch(activeId, () => nextTick(moveIndicator));

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", moveIndicator);
  onScroll();

  // The section crossing the middle of the screen is the active one.
  spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = (entry.target as HTMLElement).id;
        if (entry.isIntersecting) activeId.value = links.some((link) => link.id === id) ? id : "";
      });
    },
    { rootMargin: "-45% 0px -54% 0px" },
  );
  document.querySelectorAll("main section[id]").forEach((section) => spy?.observe(section));
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  spy?.disconnect();
  window.removeEventListener("keydown", onKeydown);
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", moveIndicator);
});
</script>

<template>
  <header class="navbar" :class="{ 'is-scrolled': scrolled }">
    <div class="scroll-progress" aria-hidden="true" :style="{ transform: `scaleX(${progress})` }" />

    <div class="container navbar-inner">
      <a href="#home" class="brand" aria-label="NEX4 home" @click="closeMenu">
        <img src="/images/nex4-icon.png" alt="" class="brand-mark" />
        <span>NEX4</span>
      </a>

      <nav id="primary-navigation" class="nav-links" :class="{ active: menuOpen }" aria-label="Primary navigation">
        <span
          class="nav-indicator"
          aria-hidden="true"
          :style="{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px`, opacity: indicator.visible ? 1 : 0 }"
        />
        <a
          v-for="link in links"
          :key="link.id"
          :ref="(element) => setLink(element, link.id)"
          :href="`#${link.id}`"
          :class="{ 'is-active': activeId === link.id }"
          :aria-current="activeId === link.id ? 'location' : undefined"
          @click="closeMenu"
        >{{ link.label }}</a>
      </nav>

      <a href="#contact" class="nav-contact">Start a Project <ArrowUpRightIcon /></a>

      <button class="menu-button" :class="{ 'is-open': menuOpen }" type="button" aria-label="Toggle menu" :aria-expanded="menuOpen" aria-controls="primary-navigation" @click="menuOpen = !menuOpen">
        <span /><span />
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar { position:fixed; z-index:100; inset:0 0 auto; height:88px; padding-top:14px; pointer-events:none; transition:padding-top var(--motion-medium) var(--motion-ease); }
.navbar.is-scrolled { padding-top:9px; }
.scroll-progress { position:fixed; inset:0 0 auto; height:2px; background:var(--nex4-gradient); transform-origin:left; box-shadow:0 0 12px rgba(221,168,18,.6); }
.navbar-inner { position:relative; height:62px; display:flex; align-items:center; justify-content:space-between; padding:0 16px 0 13px; overflow:visible; border:1px solid rgba(255,255,255,.11); border-radius:999px; background:radial-gradient(circle at 12% -40%,rgba(255,255,255,.16),transparent 38%),linear-gradient(115deg,rgba(17,24,39,.78),rgba(5,7,13,.58)); box-shadow:0 18px 45px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08),inset 0 -1px 0 rgba(221,168,18,.06); backdrop-filter:blur(24px) saturate(155%); -webkit-backdrop-filter:blur(24px) saturate(155%); pointer-events:auto; animation:nav-drop .9s .1s both var(--motion-ease); transition:width var(--motion-medium) var(--motion-ease),height var(--motion-medium) var(--motion-ease),box-shadow var(--motion-medium) ease; }
.navbar.is-scrolled .navbar-inner { width:min(calc(100% - 60px),980px); height:56px; box-shadow:0 22px 55px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.08),inset 0 -1px 0 rgba(221,168,18,.12); }
.navbar-inner::before { content:""; position:absolute; inset:1px 12% auto; height:1px; border-radius:999px; background:linear-gradient(90deg,transparent,rgba(255,255,255,.34),transparent); opacity:.8; pointer-events:none; }
.navbar-inner::after { content:""; position:absolute; width:120px; height:45px; top:-18px; left:42px; border-radius:50%; background:rgba(221,168,18,.12); filter:blur(28px); pointer-events:none; }
.navbar-inner > * { position:relative; z-index:1; }
.brand { display: flex; align-items: center; gap: 10px; font-family: "Manrope", sans-serif; font-size: 18px; font-weight: 800; }
.brand-mark { width: 34px; height: 31px; object-fit: contain; transition:transform var(--motion-medium) var(--motion-spring); }
.brand:hover .brand-mark { transform:rotate(-12deg) scale(1.1); }
.nav-links { position:relative; display: flex; align-items: center; gap: 6px; }
.nav-links a { position:relative; z-index:1; padding:8px 16px; border-radius:999px; color: var(--nex4-text-secondary); font-size: 14px; transition: color .25s ease; }
.nav-links a:hover,.nav-links a.is-active { color: var(--nex4-text); }
.nav-indicator { position:absolute; z-index:0; top:50%; left:0; height:34px; margin-top:-17px; border:1px solid rgba(221,168,18,.3); border-radius:999px; background:rgba(221,168,18,.1); box-shadow:inset 0 1px 0 rgba(255,255,255,.08); transition:transform var(--motion-medium) var(--motion-ease),width var(--motion-medium) var(--motion-ease),opacity .3s ease; pointer-events:none; }
.nav-contact { display:flex; align-items:center; gap:10px; padding:10px 18px; border:1px solid rgba(255,255,255,.1); border-radius:999px; background:rgba(255,255,255,.025); font-size:14px; font-weight:600; box-shadow:inset 0 1px 0 rgba(255,255,255,.06); transition:.25s ease; }
.nav-contact:hover { border-color:var(--nex4-border-green); background:rgba(221,168,18,.09); box-shadow:0 8px 24px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.09); }
.nav-contact :deep(svg) { color: var(--nex4-green); transition:transform var(--motion-fast) var(--motion-ease); }
.nav-contact:hover :deep(svg) { transform:translate(2px,-2px); }
.menu-button { display: none; padding: 10px; border: 0; background: transparent; }
.menu-button span { width: 22px; height: 1px; background: white; transition:transform .3s var(--motion-ease); }
.menu-button.is-open span:first-child { transform:translateY(3px) rotate(45deg); }
.menu-button.is-open span:last-child { transform:translateY(-3px) rotate(-45deg); }
@keyframes nav-drop { from { opacity:0; transform:translateY(-24px); } }

@media (max-width: 768px) {
  .navbar { height:82px; padding-top:10px; }
  .navbar-inner,.navbar.is-scrolled .navbar-inner { width:calc(100% - 24px); height:60px; padding:0 12px 0 11px; }
  .nav-contact,.nav-indicator { display: none; }
  .menu-button { display:flex; flex-direction:column; gap:5px; }
  .nav-links { position:fixed; top:82px; left:12px; width:calc(100% - 24px); flex-direction:column; align-items:flex-start; gap:0; padding:14px 18px; transform:translateY(-18px) scale(.98); transform-origin:top; opacity:0; visibility:hidden; border:1px solid rgba(255,255,255,.11); border-radius:20px; background:linear-gradient(145deg,rgba(17,24,39,.94),rgba(5,7,13,.88)); box-shadow:0 24px 55px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.07); backdrop-filter:blur(28px) saturate(150%); -webkit-backdrop-filter:blur(28px) saturate(150%); transition:.25s ease; }
  .nav-links.active { transform:translateY(0) scale(1); opacity:1; visibility:visible; }
  .nav-links a { width: 100%; padding: 15px 0; border-radius:0; border-bottom: 1px solid var(--nex4-border); }
  .nav-links a.is-active { color:var(--nex4-gold); }
  .nav-links a:last-child { border-bottom:0; }
}
</style>
