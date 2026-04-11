import type { ChartPageData, GalleryIndexPageData, GalleryDetailPageData } from "./types";
import { pages as barChart } from "./bar-chart";
import { pages as lineChart } from "./line-chart";
import { pages as areaChart } from "./area-chart";
import { pages as pieChart } from "./pie-chart";
import { pages as scatterChart } from "./scatter-chart";
import { pages as radarChart } from "./radar-chart";
import { pages as bubbleChart } from "./bubble-chart";
import { pages as heatmapChart } from "./heatmap-chart";
import { pages as stackedBarChart } from "./stacked-bar-chart";
import { pages as stackedAreaChart } from "./stacked-area-chart";
import { pages as candlestickChart } from "./candlestick-chart";
import { galleryEntries } from "./gallery";
import { apiPages } from "./api";

export type {
  ChartPageData,
  OverviewPageData,
  GalleryIndexPageData,
  GalleryDetailPageData,
  ApiPageData,
  ConfigSection,
  ConfigRow,
  CustomElement,
  ChartModule,
} from "./types";

// Gallery pages (auto-generated from entries)
const galleryIndex: GalleryIndexPageData = {
  slug: ["gallery"],
  title: "Chart Gallery",
  description: "Browse all available chart styles.",
  pageType: "gallery-index",
};

const galleryDetails: GalleryDetailPageData[] = galleryEntries.map((entry) => ({
  slug: ["gallery", entry.slug],
  title: entry.title,
  description: `${entry.title} in ${entry.style} style`,
  pageType: "gallery-detail",
  entry,
  relatedEntries: galleryEntries.filter(
    (e) => e.chartType === entry.chartType && e.slug !== entry.slug,
  ),
}));

export const chartPages: ChartPageData[] = [
  ...barChart,
  ...lineChart,
  ...areaChart,
  ...pieChart,
  ...scatterChart,
  ...radarChart,
  ...bubbleChart,
  ...heatmapChart,
  ...stackedBarChart,
  ...stackedAreaChart,
  ...candlestickChart,
  galleryIndex,
  ...galleryDetails,
  ...apiPages,
];

export function findChartPage(slug: string[]): ChartPageData | undefined {
  return chartPages.find(
    (p) => p.slug.length === slug.length && p.slug.every((s, i) => s === slug[i]),
  );
}

export function getChildPages(parentSlug: string): ChartPageData[] {
  return chartPages.filter(
    (p) => p.pageType !== "overview" && "parent" in p && p.parent === parentSlug,
  );
}

export function getAllSlugs(): string[][] {
  return chartPages.map((p) => p.slug);
}
