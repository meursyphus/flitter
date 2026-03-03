import type { ChartModule } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import { DefaultToastBubbleChart } from "./toast/examples";
import { DefaultAgBubbleChart } from "./ag/examples";
import { advancedPage } from "./advanced";

const basicCode = `import { BubbleChart } from "flitter-ui/chart";
import { Widget } from "@flitterjs/react";

// Create chart widget
const chart = BubbleChart({
  style: "toast",
  data: {
    datasets: [
      {
        legend: "Series A",
        data: [
          { x: 10, y: 20, value: 100, label: "Point 1" },
          { x: 30, y: 50, value: 300, label: "Point 2" },
          { x: 50, y: 40, value: 200, label: "Point 3" },
        ],
      },
    ],
  },
});

// Render with React
<Widget widget={chart} width={600} height={400} />`;

export const pages: ChartModule = [
  {
    slug: ["bubble-chart"],
    title: "Bubble Chart",
    description:
      "Visualize three dimensions of data with positioned, sized bubbles.",
    pageType: "overview",
    quickStartCode: basicCode,
    hasAdvanced: true,
    styles: [
      toastSummary("bubble-chart", <DefaultToastBubbleChart />),
      agSummary("bubble-chart", <DefaultAgBubbleChart />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
