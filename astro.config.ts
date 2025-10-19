// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  site: "https://quizbowl.co.uk",
  integrations: [sitemap()],
  output: process.env.ASTRO_PREVIEW === "1" ? undefined : "server",
  adapter: process.env.ASTRO_PREVIEW === "1" ? undefined : cloudflare(),
});
