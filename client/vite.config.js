import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "pwa-192x192.png",
        "pwa-512x512.png"
      ],

      manifest: {
        name: "Sentinel AI - Emergency Response",
        short_name: "Sentinel AI",

        description:
          "AI-assisted emergency response and first aid assistance system.",

        theme_color: "#060b14",
        background_color: "#060b14",

        display: "standalone",

start_url: "/home",
        scope: "/",

        orientation: "portrait-primary",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },

      workbox: {
        cleanupOutdatedCaches: true,

        globPatterns: [
          "**/*.{js,css,html,ico,png,svg}"
        ]
      },

      devOptions: {
        enabled: true
      }
    })
  ],

  server: {
    host: true,
    port: 5173,

    allowedHosts: [
      ".trycloudflare.com"
    ],

    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});