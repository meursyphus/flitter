import type { ChartModule } from "../types";

const basicCode = `import HeatmapChart from "./charts/heatmap-chart";
import Widget from "@flitterjs/react";

const chart = HeatmapChart({
  data: {
    labels: {
      x: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      y: ["Morning", "Afternoon", "Evening"],
    },
    datasets: [
      { legend: "Activity", data: [[5, 8, 3, 7, 9], [4, 6, 8, 5, 3], [7, 2, 6, 4, 8]] },
    ],
  },
});

<Widget widget={chart} width={600} height={400} />`;

export const pages: ChartModule = [
  {
    slug: ["heatmap-chart"],
    title: "Heatmap Chart",
    description:
      "Spot patterns in dense data. Activity over time, correlation matrices, server load — color-code the intensity.",
    pageType: "overview",
    quickStartCode: basicCode,
  },
];
