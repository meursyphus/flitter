import type { ChartModule } from "../types";
import { toastSummary } from "../styles/toast";
import { toastStyle } from "./toast";
import { BasicRadarChart } from "./toast/examples";
import { advancedPage } from "./advanced";

export const pages: ChartModule = [
  {
    slug: ["radar-chart"],
    title: "Radar Chart",
    description:
      "Compare multiple variables across categories on a radial grid.",
    pageType: "overview",
    hasAdvanced: true,
    styles: [
      toastSummary("radar-chart", <BasicRadarChart />),
    ],
  },
  toastStyle,
  advancedPage,
];
