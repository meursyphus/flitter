import type { ChartModule } from "../types";

const basicCode = `import LineChart from "./charts/line-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = LineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      { legend: "Revenue", values: [40, 65, 50, 80] },
    ],
  },
});

// Render with React
<Widget widget={chart} width={600} height={400} />`;

export const pages: ChartModule = [
  {
    slug: ["line-chart"],
    title: "Line Chart",
    description:
      "Show change over time. Revenue trends, user growth, sensor readings — connect the dots and see the story.",
    pageType: "overview",
    quickStartCode: basicCode,
  },
];
