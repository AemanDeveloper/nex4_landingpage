<script setup lang="ts">
import ArrowUpRightIcon from "~/components/ui/ArrowUpRightIcon.vue";
</script>

<template>
  <section id="contact" class="contact-section">
    <div class="contact-grid" />

    <div class="contact-glow" />

    <div class="container contact-content">
      <div class="contact-label">HAVE AN IDEA?</div>

      <h2>
        Let's build something
        <span> together. </span>
      </h2>

      <p>
        Starting something new or improving an existing product? Tell us what
        you're working on and let's see what we can build.
      </p>

      <div class="contact-actions">
        <a href="mailto:nex4digitalstudio@gmail.com" class="contact-primary">
          nex4digitalstudio@gmail.com

          <ArrowUpRightIcon />
        </a>
      </div>

      <div class="contact-services">
        <span> Websites </span>

        <i />

        <span> Mobile Apps </span>

        <i />

        <span> Digital Products </span>

        <i />

        <span> Marketing </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  position: relative;

  min-height: 720px;

  display: flex;
  align-items: center;

  overflow: hidden;

  padding: 150px 0;

  border-top: 1px solid var(--nex4-border);

  background: #03050a;
}

.contact-content {
  position: relative;

  z-index: 3;

  text-align: center;
}

.contact-label {
  margin-bottom: 20px;

  color: var(--nex4-green);

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 2px;
}

h2 {
  max-width: 900px;

  margin: 0 auto;

  font-family: "Manrope", sans-serif;

  font-size: clamp(52px, 7vw, 94px);

  line-height: 0.98;

  letter-spacing: -5px;
}

h2 span {
  display: block;

  color: transparent;

  background: var(--nex4-gradient);

  background-clip: text;

  -webkit-background-clip: text;
}

.contact-content > p {
  max-width: 590px;

  margin: 30px auto 0;

  color: var(--nex4-text-secondary);

  font-size: 15px;

  line-height: 1.8;
}

.contact-actions {
  display: flex;

  justify-content: center;

  flex-wrap: wrap;

  gap: 12px;

  margin-top: 40px;
}

.contact-primary,
.contact-secondary {
  min-height: 55px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0 25px;

  border-radius: 999px;

  font-size: 14px;

  font-weight: 600;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease;
}

.contact-primary {
  gap: 14px;

  background: var(--nex4-green);

  color: var(--nex4-navy);

  box-shadow: 0 15px 50px rgba(221, 168, 18, 0.18);
}

.contact-primary:hover {
  transform: translateY(-3px);
}

.contact-secondary {
  border: 1px solid var(--nex4-border);

  color: var(--nex4-text-secondary);
}

.contact-secondary:hover {
  transform: translateY(-3px);

  border-color: var(--nex4-border-green);
}

.contact-services {
  display: flex;

  justify-content: center;
  align-items: center;

  flex-wrap: wrap;

  gap: 16px;

  margin-top: 80px;

  color: var(--nex4-text-muted);

  font-size: 12px;

  letter-spacing: 1.2px;

  text-transform: uppercase;
}

.contact-services i {
  width: 4px;
  height: 4px;

  border-radius: 50%;

  background: var(--nex4-green);
}

.contact-glow {
  position: absolute;

  width: 900px;
  height: 600px;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(221, 168, 18, 0.14),
    rgba(17, 24, 39, 0.08) 40%,
    transparent 70%
  );

  pointer-events: none;
}

.contact-grid {
  position: absolute;

  inset: 0;

  opacity: 0.25;

  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);

  background-size: 60px 60px;

  mask-image: radial-gradient(circle, black, transparent 70%);
}

@media (max-width: 600px) {
  .contact-section {
    min-height: auto;

    padding: 96px 0 calc(82px + env(safe-area-inset-bottom));

    scroll-margin-top: 76px;
  }

  h2 {
    font-size: clamp(42px, 13vw, 50px);

    line-height: 1.02;

    letter-spacing: -3px;
  }

  .contact-content > p {
    margin-top: 24px;

    line-height: 1.7;
  }

  .contact-actions {
    flex-direction: column;
  }

  .contact-primary,
  .contact-secondary {
    width: 100%;
  }

  .contact-primary {
    padding: 0 16px;

    font-size: clamp(12px, 3.55vw, 14px);

    white-space: nowrap;
  }

  .contact-services {
    display: grid;

    grid-template-columns: repeat(2, minmax(0, 1fr));

    margin-top: 48px;

    gap: 14px 10px;

    font-size: 10px;

    letter-spacing: 0.9px;
  }

  .contact-services span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    white-space: nowrap;
  }

  .contact-services span::before {
    content: "";

    width: 4px;
    height: 4px;

    flex: 0 0 auto;

    border-radius: 50%;

    background: var(--nex4-green);
  }

  .contact-services i {
    display: none;
  }
}
</style>
