<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import ArrowUpRightIcon from "~/components/ui/ArrowUpRightIcon.vue";

const menuOpen = ref(false);
const closeMenu = () => (menuOpen.value = false);
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") closeMenu();
};

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <a href="#home" class="brand" aria-label="NEX4 home" @click="closeMenu">
        <img src="/images/nex4-icon.png" alt="" class="brand-mark" />
        <span>NEX4</span>
      </a>

      <nav id="primary-navigation" class="nav-links" :class="{ active: menuOpen }" aria-label="Primary navigation">
        <a href="#work" @click="closeMenu">Work</a>
        <a href="#services" @click="closeMenu">Services</a>
        <a href="#about" @click="closeMenu">About</a>
        <a href="#team" @click="closeMenu">Team</a>
      </nav>

      <a href="#contact" class="nav-contact">Start a Project <ArrowUpRightIcon /></a>

      <button class="menu-button" type="button" aria-label="Toggle menu" :aria-expanded="menuOpen" aria-controls="primary-navigation" @click="menuOpen = !menuOpen">
        <span /><span />
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar { position:fixed; z-index:100; inset:0 0 auto; height:88px; padding-top:14px; pointer-events:none; }
.navbar-inner { position:relative; height:62px; display:flex; align-items:center; justify-content:space-between; padding:0 16px 0 13px; overflow:visible; border:1px solid rgba(255,255,255,.11); border-radius:999px; background:radial-gradient(circle at 12% -40%,rgba(255,255,255,.16),transparent 38%),linear-gradient(115deg,rgba(15,25,17,.74),rgba(5,10,6,.52)); box-shadow:0 18px 45px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08),inset 0 -1px 0 rgba(50,239,69,.04); backdrop-filter:blur(24px) saturate(155%); -webkit-backdrop-filter:blur(24px) saturate(155%); pointer-events:auto; }
.navbar-inner::before { content:""; position:absolute; inset:1px 12% auto; height:1px; border-radius:999px; background:linear-gradient(90deg,transparent,rgba(255,255,255,.34),transparent); opacity:.8; pointer-events:none; }
.navbar-inner::after { content:""; position:absolute; width:120px; height:45px; top:-18px; left:42px; border-radius:50%; background:rgba(50,239,69,.1); filter:blur(28px); pointer-events:none; }
.navbar-inner > * { position:relative; z-index:1; }
.brand { display: flex; align-items: center; gap: 10px; font-family: "Manrope", sans-serif; font-size: 18px; font-weight: 800; }
.brand-mark { width: 31px; height: 31px; border-radius: 8px; object-fit: cover; }
.nav-links { display: flex; align-items: center; gap: 38px; }
.nav-links a { color: var(--nex4-text-secondary); font-size: 14px; transition: color .2s ease; }
.nav-links a:hover { color: var(--nex4-green); }
.nav-contact { display:flex; align-items:center; gap:10px; padding:10px 18px; border:1px solid rgba(255,255,255,.1); border-radius:999px; background:rgba(255,255,255,.025); font-size:14px; font-weight:600; box-shadow:inset 0 1px 0 rgba(255,255,255,.06); transition:.25s ease; }
.nav-contact:hover { border-color:var(--nex4-border-green); background:rgba(50,239,69,.08); box-shadow:0 8px 24px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.09); }
.nav-contact :deep(svg) { color: var(--nex4-green); }
.menu-button { display: none; padding: 10px; border: 0; background: transparent; }
.menu-button span { width: 22px; height: 1px; background: white; }

@media (max-width: 768px) {
  .navbar { height:82px; padding-top:10px; }
  .navbar-inner { width:calc(100% - 24px); height:60px; padding:0 12px 0 11px; }
  .nav-contact { display: none; }
  .menu-button { display:flex; flex-direction:column; gap:5px; }
  .nav-links { position:fixed; top:82px; left:12px; width:calc(100% - 24px); flex-direction:column; align-items:flex-start; gap:0; padding:14px 18px; transform:translateY(-18px) scale(.98); transform-origin:top; opacity:0; visibility:hidden; border:1px solid rgba(255,255,255,.11); border-radius:20px; background:linear-gradient(145deg,rgba(16,25,18,.9),rgba(3,7,4,.82)); box-shadow:0 24px 55px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.07); backdrop-filter:blur(28px) saturate(150%); -webkit-backdrop-filter:blur(28px) saturate(150%); transition:.25s ease; }
  .nav-links.active { transform:translateY(0) scale(1); opacity:1; visibility:visible; }
  .nav-links a { width: 100%; padding: 15px 0; border-bottom: 1px solid var(--nex4-border); }
  .nav-links a:last-child { border-bottom:0; }
}
</style>
