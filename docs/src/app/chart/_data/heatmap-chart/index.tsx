import type { ChartModule } from "../types";
import { toastSummary } from "../styles/toast";
import { toastStyle } from "./toast";
import { BasicHeatmapChart } from "./toast/examples";
import { advancedPage } from "./advanced";

export const pages: ChartModule = [
  {
    slug: ["heatmap-chart"],
    title: "Heatmap Chart",
    description:
      "Reveal patterns in matrix data through color intensity mapping.",
    pageType: "overview",
    hasAdvanced: true,
    styles: [
      toastSummary("heatmap-chart", <BasicHeatmapChart />),
    ],
  },
  toastStyle,
  advancedPage,
];
