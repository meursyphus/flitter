import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  trailingSlash: true,
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          // Emitted as --shiki-dark / --shiki-light; globals.css picks one.
          theme: { dark: "one-dark-pro", light: "github-light" },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
