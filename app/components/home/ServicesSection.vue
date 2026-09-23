<script setup lang="ts">
import { services } from "~/data/home";
</script>

<template>
  <section id="services" class="section services">
    <div class="container">
      <div class="services-header">
        <div>
          <div class="section-label">01 / SERVICES</div>

          <h2 class="section-title">
            Everything you need
            <br />

            <span> to go digital. </span>
          </h2>
        </div>

        <p>
          Development and marketing working together to turn ideas into useful
          digital experiences.
        </p>
      </div>

      <div class="services-grid">
        <article
          v-for="service in services"
          :key="service.title"
          class="service-card"
        >
          <span class="service-number">
            {{ service.number }}
          </span>

          <div class="service-icon">+</div>

          <h3>
            {{ service.title }}
          </h3>

          <p>
            {{ service.description }}
          </p>

          <div class="line" />

          <ul>
            <li v-for="item in service.items" :key="item">
              <span>+</span>

              {{ item }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  border-top: 1px solid var(--nex4-border);

  background: linear-gradient(180deg, var(--nex4-bg), var(--nex4-bg-soft));
}

.services-header {
  display: grid;

  grid-template-columns: 1fr 400px;

  align-items: end;

  gap: 60px;

  margin-bottom: 65px;
}

.services-header > p {
  color: var(--nex4-text-secondary);

  line-height: 1.8;
}

.services-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 15px;
}

.service-card {
  position: relative;
  overflow: hidden;
  min-height: 450px;

  padding: 30px;

  border: 1px solid var(--nex4-border);

  border-radius: 18px;

  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.025),
    rgba(255, 255, 255, 0.007)
  );

  transition: 0.3s ease;
}

.service-card::before {
  content: "";
  position: absolute;
  width: 220px;
  height: 220px;
  top: -140px;
  right: -140px;
  border-radius: 50%;
  background: rgba(50, 239, 69, 0.12);
  filter: blur(55px);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.service-card:hover {
  transform: translateY(-6px);

  border-color: var(--nex4-border-green);

  background: linear-gradient(145deg, rgba(64, 240, 68, 0.06), transparent);
}

.service-card:hover::before { opacity: 1; }

.service-number {
  color: var(--nex4-text-muted);

  font-size: 12px;
}

.service-icon {
  width: 45px;
  height: 45px;

  display: grid;
  place-items: center;

  margin-left: auto;

  border: 1px solid var(--nex4-border);

  border-radius: 50%;

  color: var(--nex4-green);

  font-size: 21px;
}

h3 {
  margin-top: 75px;

  font-family: "Manrope", sans-serif;

  font-size: 24px;

  letter-spacing: -1px;
}

.service-card > p {
  min-height: 80px;

  margin-top: 13px;

  color: var(--nex4-text-secondary);

  font-size: 14px;

  line-height: 1.75;
}

.line {
  height: 1px;

  margin: 25px 0;

  background: var(--nex4-border);
}

ul {
  display: grid;

  gap: 9px;

  list-style: none;
}

li {
  color: var(--nex4-text-secondary);

  font-size: 14px;
}

li span {
  margin-right: 8px;

  color: var(--nex4-green);
}

@media (max-width: 850px) {
  .services-header {
    grid-template-columns: 1fr;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .service-card {
    min-height: 400px;
  }
}
</style>
