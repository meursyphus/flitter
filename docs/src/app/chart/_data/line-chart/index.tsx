import type { ChartModule } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import { DefaultToastLineChart } from "./toast/examples";
import { DefaultAgLineChart } from "./ag/examples";
import { advancedPage } from "./advanced";

const basicCode = `import { LineChart } from "flitter-ui/chart";
import { Widget } from "@flitterjs/react";

// Create chart widget
const chart = LineChart({
  style: "toast",
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
      "Visualize trends over time with smooth, animated lines.",
    pageType: "overview",
    hasAdvanced: true,
    quickStartCode: basicCode,
    styles: [
      toastSummary("line-chart", <DefaultToastLineChart />),
      agSummary("line-chart", <DefaultAgLineChart />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
