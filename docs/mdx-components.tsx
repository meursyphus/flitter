import type { MDXComponents } from "mdx/types";
import ChartPreview from "@/components/chart-preview";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ChartPreview,
  };
}
