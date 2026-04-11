import type { ChartModule } from "../types";

const basicCode = `import RadarChart from "./charts/radar-chart";
import Widget from "@flitterjs/react";

const chart = RadarChart({
  data: {
    labels: ["Speed", "Power", "Technique", "Stamina", "Defense"],
    datasets: [
      { legend: "Player A", values: [80, 90, 70, 85, 75] },
      { legend: "Player B", values: [65, 75, 90, 70, 85] },
    ],
  },
});

<Widget widget={chart} width={600} height={400} />`;

export const pages: ChartModule = [
  {
    slug: ["radar-chart"],
    title: "Radar Chart",
    description:
      "Compare multiple dimensions at once. Skill profiles, product comparisons, performance reviews — see the shape of multi-variate data.",
    pageType: "overview",
    quickStartCode: basicCode,
  },
];
