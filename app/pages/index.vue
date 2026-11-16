<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import HomeNavbar from "~/components/home/HomeNavbar.vue";
import HeroSection from "~/components/home/HeroSection.vue";
import ServicesSection from "~/components/home/ServicesSection.vue";
import KineticBand from "~/components/home/KineticBand.vue";
import ProjectsSection from "~/components/home/ProjectsSection.vue";
import AboutSection from "~/components/home/AboutSection.vue";
import TeamSection from "~/components/home/TeamSection.vue";
import ContactSection from "~/components/home/ContactSection.vue";
import HomeFooter from "~/components/home/HomeFooter.vue";

const siteUrl = "https://nex4.my";
const siteTitle = "NEX4 — Digital Products, Development & Marketing";
const siteDescription =
  "NEX4 is a Malaysia-based digital studio building websites, mobile applications, AI-powered products and practical marketing experiences.";

usePointerSpotlight();

let revealObserver: IntersectionObserver | undefined;
const cleanups: Array<() => void> = [];

// Buttons marked [data-magnetic] lean towards the cursor and spring back on leave.
const bindMagnetic = (element: HTMLElement) => {
  const onMove = (event: PointerEvent) => {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.22;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.32;
    element.style.transition = "transform 120ms ease-out";
    element.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };
  const onLeave = () => {
    element.style.transition = "transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    element.style.transform = "";
  };
  element.addEventListener("pointermove", onMove);
  element.addEventListener("pointerleave", onLeave);
  cleanups.push(() => {
    element.removeEventListener("pointermove", onMove);
    element.removeEventListener("pointerleave", onLeave);
  });
};

onMounted(() => {
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

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

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach(bindMagnetic);
  }
});

onBeforeUnmount(() => {
  revealObserver?.disconnect();
  cleanups.forEach((cleanup) => cleanup());
});

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
        email: "nex4digitalstudio@gmail.com",
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

      <KineticBand />

      <ProjectsSection />

      <AboutSection />

      <TeamSection />

      <ContactSection />
    </main>

    <HomeFooter />
  </div>
</template>
