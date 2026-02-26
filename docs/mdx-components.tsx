import type { MDXComponents } from "mdx/types";
import ChartPreview from "@/components/ChartPreview";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ChartPreview,
  };
}
