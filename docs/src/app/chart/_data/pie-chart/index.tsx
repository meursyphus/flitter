import type { ChartModule } from "../types";

const basicCode = `import PieChart from "./charts/pie-chart";
import Widget from "@flitterjs/react";

const chart = PieChart({
  data: {
    datasets: [
      {
        legend: "Market Share",
        data: [
          { label: "Chrome", value: 65 },
          { label: "Safari", value: 18 },
          { label: "Firefox", value: 10 },
          { label: "Edge", value: 7 },
        ],
      },
    ],
  },
});

<Widget widget={chart} width={600} height={400} />`;

export const pages: ChartModule = [
  {
    slug: ["pie-chart"],
    title: "Pie Chart",
    description:
      "Show parts of a whole. Market share, budget allocation, survey distribution — when the total matters as much as the pieces.",
    pageType: "overview",
    quickStartCode: basicCode,
  },
];
