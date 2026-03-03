import type { ChartModule } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import { VerticalToastBarChart } from "./toast/examples";
import { VerticalAgBarChart } from "./ag/examples";
import { advancedPage } from "./advanced";

const basicCode = `import { BarChart } from "flitter-ui/chart";
import { Widget } from "@flitterjs/react";

// Create chart widget
const chart = BarChart({
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
    slug: ["bar-chart"],
    title: "Bar Chart",
    description:
      "Compare quantities across categories with elegant, animated bars.",
    pageType: "overview",
    quickStartCode: basicCode,
    styles: [
      toastSummary("bar-chart", <VerticalToastBarChart />),
      agSummary("bar-chart", <VerticalAgBarChart />),
    ],
    hasAdvanced: true,
  },
  toastStyle,
  agStyle,
  advancedPage,
];
