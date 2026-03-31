import { agStylePage } from "../../styles/ag";
import {
  BasicAgRadarChart,
  SkillComparisonAgRadar,
  ProductReviewAgRadar,
  TeamPerformanceAgRadar,
  AssessmentOverviewAg,
} from "./examples";

const radarConfigSections = [
  {
    title: "Radar",
    description: "Radar-specific visual settings.",
    rows: [
      { property: "radar.fillOpacity", type: "number", default: "0.3", description: "Fill opacity of radar areas (0-1)" },
      { property: "radar.strokeWidth", type: "number", default: "2", description: "Stroke width of radar outlines (px)" },
      { property: "radar.gridColor", type: "string", default: '"rgba(0, 0, 0, 0.1)"', description: "Grid line color" },
      { property: "radar.gridWidth", type: "number", default: "1", description: "Grid line width (px)" },
      { property: "radar.axisColor", type: "string", default: '"rgba(0, 0, 0, 0.1)"', description: "Axis line color" },
      { property: "radar.axisWidth", type: "number", default: "1", description: "Axis line width (px)" },
      { property: "radar.labelMargin", type: "number", default: "24", description: "Margin around radar for axis labels (px)" },
    ],
  },
];

export const agStyle = agStylePage("radar-chart", {
  extraConfigSections: radarConfigSections,
  examples: [
    {
      title: "Basic Radar",
      chart: <BasicAgRadarChart />,
      code: `import Widget from "@flitterjs/react";
import RadarChart from "./charts/radar-chart";

const chart = RadarChart({
  data: {
    labels: ["JavaScript", "TypeScript", "React", "Node.js", "CSS", "GraphQL", "Testing", "DevOps"],
    datasets: [
      { legend: "Senior Dev", values: [95, 90, 85, 80, 70, 75, 80, 65] },
      { legend: "Junior Dev", values: [70, 50, 60, 40, 65, 30, 35, 20] },
      { legend: "Full Stack", values: [80, 75, 70, 85, 60, 65, 70, 80] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Skill Comparison",
      chart: <SkillComparisonAgRadar />,
      code: `import Widget from "@flitterjs/react";
import RadarChart from "./charts/radar-chart";

const chart = RadarChart({
  data: {
    labels: ["Leadership", "Problem Solving", "Communication", "Technical", "Creativity", "Teamwork"],
    datasets: [
      { legend: "Alice", values: [90, 85, 95, 70, 80, 92] },
      { legend: "Bob", values: [75, 92, 60, 95, 65, 78] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Product Review",
      chart: <ProductReviewAgRadar />,
      code: `import Widget from "@flitterjs/react";
import RadarChart from "./charts/radar-chart";

const chart = RadarChart({
  data: {
    labels: ["Price", "Quality", "Design", "Durability", "Support"],
    datasets: [
      { legend: "Product A", values: [60, 90, 85, 95, 70] },
      { legend: "Product B", values: [85, 70, 75, 60, 90] },
      { legend: "Product C", values: [75, 80, 90, 80, 65] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Team Performance",
      chart: <TeamPerformanceAgRadar />,
      code: `import Widget from "@flitterjs/react";
import RadarChart from "./charts/radar-chart";

const chart = RadarChart({
  data: {
    labels: ["Speed", "Quality", "Communication", "Innovation", "Reliability"],
    datasets: [
      { legend: "Frontend", values: [88, 82, 90, 85, 78] },
      { legend: "Backend", values: [75, 95, 72, 70, 92] },
      { legend: "DevOps", values: [80, 88, 68, 75, 98] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Assessment Overview",
      chart: <AssessmentOverviewAg />,
      code: `import Widget from "@flitterjs/react";
import RadarChart from "./charts/radar-chart";

const chart = RadarChart({
  data: {
    labels: ["Analytics", "Strategy", "Delivery", "Communication", "Leadership"],
    datasets: [
      { legend: "Self", values: [82, 78, 90, 85, 70] },
      { legend: "Manager", values: [75, 88, 85, 80, 82] },
      { legend: "Peer", values: [80, 72, 88, 92, 68] },
    ],
  },
  config: {
    legend: { position: "right-top" },
    background: "#f8fafc",
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
