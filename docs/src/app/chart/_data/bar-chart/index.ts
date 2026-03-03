import type { ChartModule } from "../types";
import { toastStyle } from "./toast";
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
      {
        slug: ["bar-chart", "toast"],
        title: "Toast Style",
        tagline: "Clean, minimal, smooth animations",
        inspiration: "Inspired by Toast UI Chart",
      },
    ],
    hasAdvanced: true,
  },
  toastStyle(basicCode),
  advancedPage,
];
