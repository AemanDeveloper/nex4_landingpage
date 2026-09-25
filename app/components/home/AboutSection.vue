<template>
  <section id="about" class="section about-section">
    <div class="about-glow" />

    <div class="container about-layout">
      <div class="about-heading">
        <div class="section-label">03 / ABOUT NEX4</div>

        <h2 class="section-title">
          Small team.
          <br />
          <span>Big ideas.</span>
        </h2>
      </div>

      <div class="about-content">
        <p class="about-lead">
          NEX4 is an independent digital team bringing development and marketing
          together.
        </p>

        <p>
          We help businesses turn ideas into digital experiences — from websites
          and mobile applications to digital products and marketing strategies
          built around real business needs.
        </p>

        <p>
          We believe good digital products do not need unnecessary complexity.
          They need clear ideas, strong execution and the right strategy.
        </p>

        <div class="about-values">
          <article>
            <span>01</span>

            <div>
              <strong> Build with purpose. </strong>

              <p>Every product should solve a real problem.</p>
            </div>
          </article>

          <article>
            <span>02</span>

            <div>
              <strong> Keep it practical. </strong>

              <p>Technology should make things easier, not harder.</p>
            </div>
          </article>

          <article>
            <span>03</span>

            <div>
              <strong> Create together. </strong>

              <p>Development and marketing work better together.</p>
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
}

@media (max-width: 600px) {
  .about-content .about-lead {
    font-size: 20px;
  }
}
</style>
