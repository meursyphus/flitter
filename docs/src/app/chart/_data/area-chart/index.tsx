import type { ChartModule } from "../types";

const basicCode = `import AreaChart from "./charts/area-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = AreaChart({
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
    slug: ["area-chart"],
    title: "Area Chart",
    description:
      "Line charts with weight. Fill the area under the curve to emphasize volume, show composition, or highlight cumulative trends.",
    pageType: "overview",
    quickStartCode: basicCode,
  },
];
