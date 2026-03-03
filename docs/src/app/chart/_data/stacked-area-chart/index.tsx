import type { ChartModule } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import { DefaultToastStackedAreaChart } from "./toast/examples";
import { DefaultAgStackedAreaChart } from "./ag/examples";
import { advancedPage } from "./advanced";

const basicCode = `import { StackedAreaChart } from "flitter-ui/chart";
import { Widget } from "@flitterjs/react";

// Create chart widget
const chart = StackedAreaChart({
  style: "toast",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      { legend: "Organic", values: [400, 450, 420, 480] },
      { legend: "Direct", values: [200, 220, 210, 230] },
    ],
  },
});

// Render with React
<Widget widget={chart} width={600} height={400} />`;

export const pages: ChartModule = [
  {
    slug: ["stacked-area-chart"],
    title: "Stacked Area Chart",
    description:
      "Show cumulative trends and composition changes over time.",
    pageType: "overview",
    quickStartCode: basicCode,
    hasAdvanced: true,
    styles: [
      toastSummary("stacked-area-chart", <DefaultToastStackedAreaChart />),
      agSummary("stacked-area-chart", <DefaultAgStackedAreaChart />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
