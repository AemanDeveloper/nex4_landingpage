<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

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

      <a href="#contact" class="nav-contact">Start a Project <span aria-hidden="true">↗</span></a>

      <button class="menu-button" type="button" aria-label="Toggle menu" :aria-expanded="menuOpen" aria-controls="primary-navigation" @click="menuOpen = !menuOpen">
        <span /><span />
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar { position: fixed; z-index: 100; inset: 0 0 auto; height: 78px; border-bottom: 1px solid var(--nex4-border); background: rgba(5,7,5,.82); backdrop-filter: blur(22px); }
.navbar-inner { height: 100%; display: flex; align-items: center; justify-content: space-between; }
.brand { display: flex; align-items: center; gap: 10px; font-family: "Manrope", sans-serif; font-size: 18px; font-weight: 800; }
.brand-mark { width: 31px; height: 31px; border-radius: 8px; object-fit: cover; }
.nav-links { display: flex; align-items: center; gap: 38px; }
.nav-links a { color: var(--nex4-text-secondary); font-size: 14px; transition: color .2s ease; }
.nav-links a:hover { color: var(--nex4-green); }
.nav-contact { display: flex; align-items: center; gap: 10px; padding: 10px 18px; border: 1px solid var(--nex4-border); border-radius: 999px; font-size: 14px; font-weight: 600; transition: .25s ease; }
.nav-contact:hover { border-color: var(--nex4-border-green); background: rgba(50,239,69,.05); }
.nav-contact span { color: var(--nex4-green); }
.menu-button { display: none; padding: 10px; border: 0; background: transparent; }
.menu-button span { width: 22px; height: 1px; background: white; }

@media (max-width: 768px) {
  .nav-contact { display: none; }
  .menu-button { display: flex; flex-direction: column; gap: 5px; }
  .nav-links { position: fixed; top: 78px; left: 0; width: 100%; flex-direction: column; align-items: flex-start; gap: 0; padding: 20px 24px; transform: translateY(-140%); opacity: 0; visibility: hidden; border-bottom: 1px solid var(--nex4-border); background: rgba(3,5,3,.98); transition: .25s ease; }
  .nav-links.active { transform: translateY(0); opacity: 1; visibility: visible; }
  .nav-links a { width: 100%; padding: 15px 0; border-bottom: 1px solid var(--nex4-border); }
}
</style>
