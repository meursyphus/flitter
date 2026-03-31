import { agStylePage } from "../../styles/ag";
import { DefaultAgStackedAreaChart, ResourceAllocationStackedArea, RevenueStreamsMinimalAg } from "./examples";

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
    {
      title: "Revenue Streams (Minimal)",
      chart: <RevenueStreamsMinimalAg />,
      code: `import StackedAreaChart from "./charts/stacked-area-chart";
import Widget from "@flitterjs/react";

const chart = StackedAreaChart({
  data: {
    labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25"],
    datasets: [
      { legend: "SaaS", values: [3200, 3600, 4100, 4500, 5000, 5400] },
      { legend: "Services", values: [1400, 1500, 1350, 1600, 1700, 1550] },
      { legend: "Licensing", values: [800, 850, 900, 950, 1000, 1050] },
    ],
  },
  config: {
    colors: { fills: ["#4f46e5", "#0891b2", "#ca8a04"], strokes: ["#4f46e5", "#0891b2", "#ca8a04"] },
    area: { opacity: 0.4 },
    axis: { xLine: { visible: false } },
    background: "#fafafa",
    grid: { dash: [3, 3], color: "#e5e5e5" },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
