export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },

  css: ["~/assets/css/theme.css", "~/assets/css/main.css"],

  routeRules: {
    "/management": {
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "X-Content-Type-Options": "nosniff",
      },
    },
    "/management/**": {
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "X-Content-Type-Options": "nosniff",
      },
    },
    "/api/management/status": {
      headers: {
        "X-Content-Type-Options": "nosniff",
      },
    },
    "/api/management/analytics": {
      headers: {
        "X-Content-Type-Options": "nosniff",
      },
    },
    "/api/telemetry/traffic": {
      headers: {
        "X-Content-Type-Options": "nosniff",
      },
    },
    "/api/telemetry/landing": {
      headers: {
        "X-Content-Type-Options": "nosniff",
      },
    },
  },

  runtimeConfig: {
    databaseUrl: "",
    managementSessionSecret: "",
    landingAnalyticsToken: "",
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "en-MY",
      },

      meta: [
        {
          name: "theme-color",
          content: "#05070d",
        },
        { name: "author", content: "NEX4" },
        { name: "application-name", content: "NEX4" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/images/nex4-icon.png" },
        { rel: "apple-touch-icon", href: "/images/nex4-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    },
  },
});
