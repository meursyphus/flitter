import type { ChartModule } from "../types";

const basicCode = `import BarChart from "./charts/bar-chart";
import Widget from "@flitterjs/react";

const chart = BarChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      { legend: "Revenue", values: [40, 65, 50, 80] },
    ],
  },
});

<Widget widget={chart} width={600} height={400} />`;

export const pages: ChartModule = [
  {
    slug: ["bar-chart"],
    title: "Bar Chart",
    description:
      "Compare categories side by side. Revenue by region, survey responses, budget vs actual — if you're comparing discrete groups, this is your chart.",
    pageType: "overview",
    quickStartCode: basicCode,
  },
];
