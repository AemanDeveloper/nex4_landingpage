export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },

  css: ["~/assets/css/theme.css", "~/assets/css/main.css"],

  app: {
    head: {
      htmlAttrs: {
        lang: "en-MY",
      },

      meta: [
        {
          name: "theme-color",
          content: "#050705",
        },
        { name: "author", content: "NEX4" },
        { name: "application-name", content: "NEX4" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    },
  },
});
