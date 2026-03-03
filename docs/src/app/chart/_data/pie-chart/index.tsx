import type { ChartModule } from "../types";
import { toastSummary } from "../styles/toast";
import { toastStyle } from "./toast";
import { BasicPieChart } from "./toast/examples";
import { advancedPage } from "./advanced";

export const pages: ChartModule = [
  {
    slug: ["pie-chart"],
    title: "Pie Chart",
    description:
      "Show proportions and percentages with elegant circular segments.",
    pageType: "overview",
    hasAdvanced: true,
    styles: [
      toastSummary("pie-chart", <BasicPieChart />),
    ],
  },
  toastStyle,
  advancedPage,
];
