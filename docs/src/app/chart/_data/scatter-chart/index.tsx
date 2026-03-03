import type { ChartModule } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import { DefaultToastScatterChart } from "./toast/examples";
import { DefaultAgScatterChart } from "./ag/examples";
import { advancedPage } from "./advanced";

const basicCode = `import { ScatterChart } from "flitter-ui/chart";
import { Widget } from "@flitterjs/react";

// Create chart widget
const chart = ScatterChart({
  style: "toast",
  data: {
    datasets: [
      {
        legend: "Series A",
        data: [
          { x: 10, y: 20, label: "Point 1" },
          { x: 30, y: 50, label: "Point 2" },
          { x: 50, y: 40, label: "Point 3" },
        ],
      },
    ],
  },
});

// Render with React
<Widget widget={chart} width={600} height={400} />`;

export const pages: ChartModule = [
  {
    slug: ["scatter-chart"],
    title: "Scatter Chart",
    description:
      "Plot individual data points to reveal correlations and distributions.",
    pageType: "overview",
    quickStartCode: basicCode,
    hasAdvanced: true,
    styles: [
      toastSummary("scatter-chart", <DefaultToastScatterChart />),
      agSummary("scatter-chart", <DefaultAgScatterChart />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
