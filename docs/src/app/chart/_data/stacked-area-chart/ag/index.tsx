import { agStylePage } from "../../styles/ag";
import { DefaultAgStackedAreaChart, ResourceAllocationStackedArea } from "./examples";

const areaConfigSections = [
  {
    title: "Area",
    rows: [
      { property: "area.opacity", type: "number", default: "0.7", description: "Fill opacity of stacked areas" },
      { property: "area.strokeWidth", type: "number", default: "2", description: "Stroke width of area outlines (px)" },
      { property: "area.spline", type: "boolean", default: "false", description: "Use spline interpolation for smooth curves" },
    ],
  },
];

export const agStyle = agStylePage("stacked-area-chart", {
  extraConfigSections: areaConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultAgStackedAreaChart />,
      code: `import StackedAreaChart from "./charts/stacked-area-chart";
import Widget from "@flitterjs/react";

const chart = StackedAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Organic", values: [400, 450, 420, 480, 520, 510, 550, 530, 560, 600, 620, 650] },
      { legend: "Direct", values: [200, 220, 210, 230, 250, 240, 260, 255, 270, 290, 300, 310] },
      { legend: "Social", values: [100, 120, 130, 140, 160, 155, 170, 165, 180, 200, 210, 220] },
      { legend: "Referral", values: [50, 60, 55, 65, 70, 75, 80, 78, 85, 90, 95, 100] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Resource Allocation",
      chart: <ResourceAllocationStackedArea />,
      code: `import StackedAreaChart from "./charts/stacked-area-chart";
import Widget from "@flitterjs/react";

const chart = StackedAreaChart({
  data: {
    labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6", "Sprint 7", "Sprint 8"],
    datasets: [
      { legend: "Development", values: [45, 50, 48, 52, 55, 50, 53, 56] },
      { legend: "QA", values: [15, 18, 20, 22, 20, 25, 22, 24] },
      { legend: "Design", values: [12, 10, 8, 10, 12, 8, 10, 8] },
      { legend: "DevOps", values: [8, 10, 12, 10, 8, 12, 10, 12] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
