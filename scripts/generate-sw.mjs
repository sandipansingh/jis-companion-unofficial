import { generateSW } from "workbox-build";

await generateSW({
  globDirectory: "dist",
  globPatterns: ["**/*.{html,js,css,json,png,svg,ico,webp}"],
  swDest: "dist/sw.js",
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

  skipWaiting: true,
  clientsClaim: true,

  navigateFallback: "/index.html",

  runtimeCaching: [
    {
      // Always revalidate HTML
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 3,
      },
    },
    {
      // JS/CSS update silently in background
      urlPattern: /\.(?:js|css)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
      },
    },
    {
      // Images cached for a week
      urlPattern: /\.(?:png|jpg|jpeg|svg|ico|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
  ],
});

console.log("Service worker generated");
