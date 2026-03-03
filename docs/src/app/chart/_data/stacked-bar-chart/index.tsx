import type { ChartModule } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import { VerticalToastStackedBarChart } from "./toast/examples";
import { VerticalAgStackedBarChart } from "./ag/examples";
import { advancedPage } from "./advanced";

const basicCode = `import { StackedBarChart } from "flitter-ui/chart";
import { Widget } from "@flitterjs/react";

// Create chart widget
const chart = StackedBarChart({
  style: "toast",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      { legend: "Product A", values: [40, 65, 50, 80] },
      { legend: "Product B", values: [30, 45, 35, 60] },
    ],
  },
});

// Render with React
<Widget widget={chart} width={600} height={400} />`;

export const pages: ChartModule = [
  {
    slug: ["stacked-bar-chart"],
    title: "Stacked Bar Chart",
    description:
      "Compare part-to-whole relationships across categories with stacked bars.",
    pageType: "overview",
    quickStartCode: basicCode,
    hasAdvanced: true,
    styles: [
      toastSummary("stacked-bar-chart", <VerticalToastStackedBarChart />),
      agSummary("stacked-bar-chart", <VerticalAgStackedBarChart />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
