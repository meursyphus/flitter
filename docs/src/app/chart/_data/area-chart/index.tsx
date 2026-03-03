import type { ChartModule } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import { DefaultToastAreaChart } from "./toast/examples";
import { DefaultAgAreaChart } from "./ag/examples";
import { advancedPage } from "./advanced";

const basicCode = `import { AreaChart } from "flitter-ui/chart";
import { Widget } from "@flitterjs/react";

// Create chart widget
const chart = AreaChart({
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
    slug: ["area-chart"],
    title: "Area Chart",
    description:
      "Display quantitative data as filled areas to show volume and trends.",
    pageType: "overview",
    quickStartCode: basicCode,
    styles: [
      toastSummary("area-chart", <DefaultToastAreaChart />),
      agSummary("area-chart", <DefaultAgAreaChart />),
    ],
    hasAdvanced: true,
  },
  toastStyle,
  agStyle,
  advancedPage,
];
