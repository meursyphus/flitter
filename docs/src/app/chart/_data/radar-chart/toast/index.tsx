import type { StylePageData, ConfigSection } from "../../types";
import { toast } from "../../styles/toast";
import { BasicRadarChart, SkillComparisonRadarChart, ProductReviewRadarChart, TeamPerformanceRadarChart, TeamPerformanceCardToast } from "./examples";

const radarConfigSections: ConfigSection[] = [
  {
    title: "Colors",
    description:
      "Dataset color palette. Colors cycle automatically when datasets exceed palette length.",
    rows: [
      {
        property: "colors",
        type: "string[]",
        default: '["#00a9ff", "#ffb840", ...]',
        description: "Color palette for radar datasets",
      },
    ],
  },
  {
    title: "Title",
    rows: [
      { property: "title.text", type: "string", default: '""', description: "Title text" },
      { property: "title.visible", type: "boolean", default: "true", description: "Show or hide the title" },
      { property: "title.color", type: "string", default: '"#333333"', description: "Text color" },
      { property: "title.fontSize", type: "number", default: "18", description: "Font size in px" },
      { property: "title.fontWeight", type: "string?", default: '"bold"', description: "Font weight" },
      { property: "title.position", type: '"top" | "bottom"', default: '"top"', description: "Placement relative to chart" },
      { property: "title.alignment", type: '"start" | "center" | "end"', default: '"start"', description: "Horizontal alignment" },
    ],
  },
  {
    title: "Legend",
    rows: [
      { property: "legend.visible", type: "boolean", default: "true" },
      { property: "legend.position", type: '"top" | "bottom" | "right" | "right-top" | "right-center" | "right-bottom"', default: '"right-top"' },
      { property: "legend.gap", type: "number", default: "12", description: "Spacing between legend and chart (px)" },
    ],
  },
  {
    title: "Padding",
    description: "Chart area padding in pixels.",
    rows: [
      { property: "padding.top", type: "number", default: "20" },
      { property: "padding.right", type: "number", default: "20" },
      { property: "padding.bottom", type: "number", default: "20" },
      { property: "padding.left", type: "number", default: "20" },
    ],
  },
  {
    title: "Animation",
    rows: [
      { property: "animation.enabled", type: "boolean", default: "true", description: "Enable entry animation" },
      { property: "animation.duration", type: "number", default: "300", description: "Animation duration (ms)" },
      { property: "animation.staggerDelay", type: "number", default: "60", description: "Delay between datasets (ms)" },
    ],
  },
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

export const toastStyle: StylePageData = {
  slug: ["radar-chart", "toast"],
  title: toast.title,
  description: `${toast.tagline} — ${toast.inspiration}.`,
  pageType: "style",
  parent: "radar-chart",
  styleMeta: {
    tagline: toast.tagline,
    inspiration: toast.inspiration,
    reference: toast.reference,
    features: [
      "Soft pastel color palette",
      "Semi-transparent filled areas",
      "Multi-dataset overlay comparison",
      "Interactive legend with series toggle",
      "Configurable grid and axis styling",
    ],
  },
  configSections: radarConfigSections,
  examples: [
    {
      title: "Basic Radar",
      chart: <BasicRadarChart />,
      code: `import ToastRadarChart from "./charts/toast-radar-chart";
import Widget from "@flitterjs/react";

const chart = ToastRadarChart({
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
      chart: <SkillComparisonRadarChart />,
      code: `import ToastRadarChart from "./charts/toast-radar-chart";
import Widget from "@flitterjs/react";

const chart = ToastRadarChart({
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
      chart: <ProductReviewRadarChart />,
      code: `import ToastRadarChart from "./charts/toast-radar-chart";
import Widget from "@flitterjs/react";

const chart = ToastRadarChart({
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
      chart: <TeamPerformanceRadarChart />,
      code: `import ToastRadarChart from "./charts/toast-radar-chart";
import Widget from "@flitterjs/react";

const chart = ToastRadarChart({
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
      title: "Team Performance Card",
      chart: <TeamPerformanceCardToast />,
      code: `import ToastRadarChart from "./charts/toast-radar-chart";
import Widget from "@flitterjs/react";

const chart = ToastRadarChart({
  data: {
    labels: ["Execution", "Collaboration", "Initiative", "Reliability", "Growth"],
    datasets: [
      { legend: "Q4 Review", values: [88, 92, 75, 95, 80] },
      { legend: "Q3 Review", values: [78, 85, 70, 90, 72] },
    ],
  },
  config: {
    title: { text: "Team Metrics", visible: true, position: "bottom", alignment: "center" },
    colors: ["#6366f1", "#a5b4fc"],
    radar: { fillOpacity: 0.2, strokeWidth: 2.5 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
};
