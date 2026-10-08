import type { MetadataRoute } from "next";
import { getAllSlugs } from "./chart/_data";
import { advancedNav, diagramNav } from "@/lib/navigation";

export const dynamic = "force-static";

const BASE_URL = "https://ui.flitter.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/chart/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/integration/`, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Chart dynamic pages
  const chartPages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${BASE_URL}/chart/${slug.join("/")}/`,
    changeFrequency: "weekly" as const,
    priority: slug[0] === "gallery" ? 0.8 : 0.7,
  }));

  // Diagram pages (the overview is the first nav item)
  const diagramPages: MetadataRoute.Sitemap = diagramNav.sections.flatMap((section) =>
    section.items.map((item) => ({
      url: `${BASE_URL}${item.href}/`,
      changeFrequency: "weekly" as const,
      priority: item.href === "/diagram" ? 0.9 : 0.7,
    })),
  );

  // Advanced pages
  const advancedPages: MetadataRoute.Sitemap = advancedNav.flatMap((section) =>
    section.items.map((item) => ({
      url: `${BASE_URL}${item.href}/`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...staticPages, ...chartPages, ...diagramPages, ...advancedPages];
}
