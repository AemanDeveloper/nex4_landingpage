<script setup lang="ts">
import { projects } from "~/data/home";
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-main">
        <div class="footer-brand-area">
          <a href="#home" class="footer-logo" aria-label="NEX4 Digital Studio home">
            <img src="/images/brand/nex4-logo-white.png" alt="NEX4 Digital Studio" class="footer-wordmark" />
          </a>

          <p>
            Digital experiences,
            <br />
            built differently.
          </p>
        </div>

        <div class="footer-navigation">
          <div>
            <span class="footer-title"> Explore </span>

            <a href="#work"> Work </a>

            <a href="#services"> Services </a>

            <a href="#about"> About </a>

            <a href="#team"> Team </a>
          </div>

          <div>
            <span class="footer-title"> Products </span>

            <template v-for="project in projects" :key="project.title">
              <a v-if="project.link" :href="project.link" target="_blank" rel="noopener noreferrer">{{ project.shortTitle }}</a>
              <span v-else class="footer-closed">{{ project.shortTitle }} <small>beta closed</small></span>
            </template>
          </div>

          <div>
            <span class="footer-title"> Services </span>

            <a href="#services"> Web Development </a>

            <a href="#services"> Mobile Apps </a>

            <a href="#services"> Digital Marketing </a>
          </div>

          <div>
            <span class="footer-title"> Connect </span>

            <a href="#contact"> Start a Project </a>

            <a href="mailto:nex4digitalstudio@gmail.com"> nex4digitalstudio@gmail.com </a>
          </div>
        </div>
      </div>

      <div class="footer-wordmark-giant" aria-hidden="true">NEX4</div>

      <div class="footer-divider" />

      <div class="footer-bottom">
        <span>
          © {{ new Date().getFullYear() }} NEX4. All rights reserved.
        </span>

        <div>
          <span class="live-dot" />

          Building from Malaysia
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 85px 0 30px;

  border-top: 1px solid var(--nex4-border);

  background: #03050a;
}

.footer-main {
  display: grid;

  grid-template-columns: 1fr 1.3fr;

  gap: 100px;
}

.footer-logo {
  display: inline-flex;
  align-items: center;

  gap: 12px;

  font-family: "Manrope", sans-serif;

  font-size: 27px;

  font-weight: 800;

  letter-spacing: -1.5px;
}

.footer-wordmark {
  width: 150px;
  height: auto;
  object-fit: contain;
}

.footer-brand-area p {
  margin-top: 23px;

  color: var(--nex4-text-muted);

  font-family: "Manrope", sans-serif;

  font-size: 19px;

  line-height: 1.55;
}

.footer-navigation {
  display: grid;

  grid-template-columns: repeat(4, auto);

  justify-content: space-between;

  gap: 40px;
}

.footer-closed {
  color: var(--nex4-text-muted);

  font-size: 14px;
}

.footer-closed small {
  margin-left: 4px;

  font-size: 10px;

  letter-spacing: 0.6px;

  text-transform: uppercase;
}

/* Outlined wordmark that fills with gold on hover. */
.footer-wordmark-giant {
  margin: 70px 0 -0.16em;

  color: transparent;

  font-family: "Manrope", sans-serif;

  font-size: clamp(110px, 27vw, 400px);

  font-weight: 800;

  line-height: 0.8;

  letter-spacing: -0.06em;

  text-align: center;

  user-select: none;

  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.17);

  background: linear-gradient(100deg, transparent 35%, rgba(221, 168, 18, 0.55) 50%, transparent 65%);

  background-size: 300% 100%;

  background-clip: text;

  -webkit-background-clip: text;

  mask-image: linear-gradient(to bottom, black 30%, transparent 96%);

  animation: wordmark-sweep 8s linear infinite;
}

@keyframes wordmark-sweep {
  from {
    background-position: 150% 0;
  }

  to {
    background-position: -150% 0;
  }
}

.footer-navigation > div {
  display: flex;

  flex-direction: column;

  gap: 9px;
}

.footer-title {
  margin-bottom: 13px;

  color: var(--nex4-text-muted);

  font-size: 12px;

  letter-spacing: 1.5px;

  text-transform: uppercase;
}

.footer-navigation a {
  width: fit-content;

  color: var(--nex4-text-secondary);

  font-size: 14px;

  background: linear-gradient(var(--nex4-gold), var(--nex4-gold)) no-repeat 0 100% / 0 1px;

  transition:
    color 0.2s ease,
    background-size var(--motion-medium) var(--motion-ease);
}

.footer-navigation a:hover {
  color: var(--nex4-green);

  background-size: 100% 1px;
}

.footer-divider {
  height: 1px;

  margin-top: 0;

  background: var(--nex4-border);
}

.footer-bottom {
  display: flex;

  justify-content: space-between;
  align-items: center;

  padding-top: 24px;

  color: var(--nex4-text-muted);

  font-size: 12px;
}

.footer-bottom > div {
  display: flex;

  align-items: center;

  gap: 7px;
}

.live-dot {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: var(--nex4-green);

  box-shadow: 0 0 8px rgba(221, 168, 18, 0.8);
}

@media (max-width: 1100px) {
  .footer-navigation {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 850px) {
  .footer-main {
    grid-template-columns: 1fr;

    gap: 60px;
  }
}

@media (max-width: 600px) {
  .footer {
    padding-top: 65px;
  }

  .footer-navigation {
    grid-template-columns: repeat(2, 1fr);

    gap: 40px;
  }

  .footer-bottom {
    flex-direction: column;

    align-items: flex-start;

    gap: 10px;
  }
}
</style>
