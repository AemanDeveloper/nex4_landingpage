<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-main">
        <div class="footer-brand-area">
          <a href="#home" class="footer-logo">
            <img src="/images/nex4-icon.png" alt="" class="footer-mark" />
            <span> NEX4 </span>
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

  background: #020402;
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

.footer-mark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
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

  grid-template-columns: repeat(3, 1fr);

  gap: 50px;
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
  color: var(--nex4-text-secondary);

  font-size: 14px;

  transition: color 0.2s ease;
}

.footer-navigation a:hover {
  color: var(--nex4-green);
}

.footer-divider {
  height: 1px;

  margin-top: 80px;

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

  box-shadow: 0 0 8px rgba(64, 240, 68, 0.8);
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
