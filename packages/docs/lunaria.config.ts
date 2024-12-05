import { defineConfig } from "@lunariajs/core/config";

export default defineConfig({
  repository: {
    name: "@meursyphus/docs",
  },
  files: [
    {
      include: ["src/content/tutorial/**/*.mdx"],
      pattern: "src/content/tutorial/@lang/@path",
      type: "universal",
    },
  ],
  sourceLocale: {
    label: "English",
    lang: "en",
  },
  locales: [
    {
      label: "Korean",
      lang: "ko",
    },
  ],
});
