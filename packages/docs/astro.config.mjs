import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
//import ts from '@ast'

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), svelte(), tailwind(), mdx()],
  redirects: {
    "/docs": "/docs/introduction",
    "/tutorial": "/tutorial/introduction",
  },
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "dracula",
      // Alternatively, provide multiple themes
      // https://shiki.style/guide/dual-themes#light-dark-dual-themes
      experimentalThemes: {
        light: "github-dark",
        dark: "github-light",
      },
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
      // Add custom transformers: https://shiki.style/guide/transformers
      // Find common transformers: https://shiki.style/packages/transformers
      transformers: [],
    },
  },
});
