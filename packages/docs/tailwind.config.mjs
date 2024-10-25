import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        modern: {
          css: {
            "--tw-prose-invert-body": theme("colors.gray[300]"),
            "--tw-prose-invert-headings": theme("colors.gray[300]"),
            "--tw-prose-invert-lead": theme("colors.gray[400]"),
            "--tw-prose-invert-links": theme("colors.gray[300]"),
            "--tw-prose-invert-bold": theme("colors.gray[300]"),
            "--tw-prose-invert-counters": theme("colors.gray[500]"),
            "--tw-prose-invert-bullets": theme("colors.gray[600]"),
            "--tw-prose-invert-hr": theme("colors.gray[700]"),
            "--tw-prose-invert-quotes": theme("colors.gray[300]"),
            "--tw-prose-invert-quote-borders": theme("colors.gray[700]"),
            "--tw-prose-invert-captions": theme("colors.gray[500]"),
            "--tw-prose-invert-code": theme("colors.gray[300]"),
            "--tw-prose-invert-pre-code": theme("colors.gray[400]"),
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": theme("colors.gray[600]"),
            "--tw-prose-invert-td-borders": theme("colors.gray[700]"),
          },
        },
      }),
    },
  },
  plugins: [typography],
};
