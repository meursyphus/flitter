import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{ts,tsx,mdx}", "./mdx-components.tsx"],
  theme: { extend: {} },
  plugins: [typography],
} satisfies Config;
