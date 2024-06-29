export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        modern: {
          css: {
            "--tw-prose-invert-body": theme("colors.gray[200]"),
            "--tw-prose-invert-headings": theme("colors.gray[200]"),
            "--tw-prose-invert-lead": theme("colors.stone[300]"),
            "--tw-prose-invert-links": theme("colors.gray[200]"),
            "--tw-prose-invert-bold": theme("colors.gray[200]"),
            "--tw-prose-invert-counters": theme("colors.stone[400]"),
            "--tw-prose-invert-bullets": theme("colors.stone[600]"),
            "--tw-prose-invert-hr": theme("colors.stone[700]"),
            "--tw-prose-invert-quotes": theme("colors.stone[100]"),
            "--tw-prose-invert-quote-borders": theme("colors.stone[700]"),
            "--tw-prose-invert-captions": theme("colors.stone[400]"),
            "--tw-prose-invert-code": theme("colors.gray[200]"),
            "--tw-prose-invert-pre-code": theme("colors.stone[300]"),
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": theme("colors.stone[600]"),
            "--tw-prose-invert-td-borders": theme("colors.stone[700]"),
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
