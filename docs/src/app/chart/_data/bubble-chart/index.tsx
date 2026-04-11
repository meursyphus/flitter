import type { ChartModule } from "../types";

const basicCode = `import BubbleChart from "./charts/bubble-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = BubbleChart({
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
      "Scatter plots with a third dimension. Add size to show magnitude — GDP vs life expectancy vs population, all in one view.",
    pageType: "overview",
    quickStartCode: basicCode,
  },
];
