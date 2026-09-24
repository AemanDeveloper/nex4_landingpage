<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import HomeNavbar from "~/components/home/HomeNavbar.vue";
import HeroSection from "~/components/home/HeroSection.vue";
import ServicesSection from "~/components/home/ServicesSection.vue";
import ProjectsSection from "~/components/home/ProjectsSection.vue";
import AboutSection from "~/components/home/AboutSection.vue";
import TeamSection from "~/components/home/TeamSection.vue";
import ContactSection from "~/components/home/ContactSection.vue";
import HomeFooter from "~/components/home/HomeFooter.vue";

const siteUrl = "https://nex4.my";
const siteTitle = "NEX4 — Digital Products, Development & Marketing";
const siteDescription =
  "NEX4 is a Malaysia-based digital studio building websites, mobile applications, AI-powered products and practical marketing experiences.";

let revealObserver: IntersectionObserver | undefined;

onMounted(() => {
  const items = document.querySelectorAll<HTMLElement>(
    ".section-label, .section-title, .services-header > p, .service-terminal, .projects-header > p, .about-content, .team-header > p, .team-card, .contact-content",
  );

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  items.forEach((item) => {
    item.classList.add("reveal-item");
    revealObserver?.observe(item);
  });
});

onBeforeUnmount(() => revealObserver?.disconnect());

useSeoMeta({
  title: siteTitle,
  description: siteDescription,
  robots: "index, follow, max-image-preview:large",
  ogTitle: siteTitle,
  ogDescription: siteDescription,
  ogType: "website",
  ogSiteName: "NEX4",
  ogLocale: "en_MY",
  ogUrl: siteUrl,
  ogImage: `${siteUrl}/images/nex4-icon.png`,
  ogImageAlt: "NEX4 digital studio logo",
  twitterCard: "summary",
  twitterTitle: siteTitle,
  twitterDescription: siteDescription,
  twitterImage: `${siteUrl}/images/nex4-icon.png`,
});

useHead({
  link: [{ rel: "canonical", href: siteUrl }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "NEX4",
        url: siteUrl,
        logo: `${siteUrl}/images/nex4-icon.png`,
        email: "hello@nex4.my",
        description: siteDescription,
        areaServed: "Malaysia",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Digital services",
          itemListElement: [
            "Web Development",
            "Mobile Application Development",
            "AI Integration",
            "Digital Marketing",
          ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
        },
      }),
    },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "NEX4",
        url: siteUrl,
        description: siteDescription,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-MY",
      }),
    },
  ],
});
</script>

<template>
  <div>
    <HomeNavbar />

    <main>
      <HeroSection />

      <ServicesSection />

      <ProjectsSection />

      <AboutSection />

      <TeamSection />

      <ContactSection />
    </main>

    <HomeFooter />
  </div>
</template>
