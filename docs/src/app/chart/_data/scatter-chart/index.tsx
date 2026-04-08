import type { ChartModule } from "../types";

const basicCode = `import ScatterChart from "./charts/scatter-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = ScatterChart({
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
      "Explore relationships between two variables. Correlation, clustering, outlier detection — plot the data and see what emerges.",
    pageType: "overview",
    quickStartCode: basicCode,
  },
];
