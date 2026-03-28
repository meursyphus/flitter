import type { ChartPageData } from "./types";
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

export type {
  ChartPageData,
  OverviewPageData,
  StylePageData,
  AdvancedPageData,
  ConfigSection,
  ConfigRow,
  CustomElement,
  ChartModule,
  ShowcaseExample,
} from "./types";

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
];

export function findChartPage(slug: string[]): ChartPageData | undefined {
  return chartPages.find(
    (p) => p.slug.length === slug.length && p.slug.every((s, i) => s === slug[i]),
  );
}

export function getChildPages(parentSlug: string): ChartPageData[] {
  return chartPages.filter(
    (p) => p.pageType !== "overview" && p.parent === parentSlug,
  );
}

export function getAllSlugs(): string[][] {
  return chartPages.map((p) => p.slug);
}
