import type { ChartModule } from "../types";

const basicCode = `import StackedBarChart from "./charts/stacked-bar-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = StackedBarChart({
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
      "Show composition within categories. Revenue breakdown by product line, workforce by department — see both the total and the parts.",
    pageType: "overview",
    quickStartCode: basicCode,
  },
];
