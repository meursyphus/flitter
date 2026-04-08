import type { ChartModule } from "../types";

const basicCode = `import StackedAreaChart from "./charts/stacked-area-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = StackedAreaChart({
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
      "Track how composition changes over time. Traffic sources, revenue streams, resource allocation — the area fills tell the story.",
    pageType: "overview",
    quickStartCode: basicCode,
  },
];
