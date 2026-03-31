import type { StylePageData, ConfigSection } from "../../types";
import { toast } from "../../styles/toast";
import { BasicHeatmapToast, ServerLoadToast, CorrelationMatrixToast, GithubActivityToast } from "./examples";

const heatmapConfigSections: ConfigSection[] = [
  {
    title: "Colors",
    description:
      "Series color palette. Colors cycle automatically when datasets exceed palette length.",
    rows: [
      {
        property: "colors",
        type: "string[]",
        default: '["#00a9ff", "#ffb840", ...]',
        description: "Color palette for series",
      },
    ],
  },
  {
    title: "Font",
    description: "Base typography applied to axis labels and legend text.",
    rows: [
      { property: "font.family", type: "string", default: '"Arial"' },
      { property: "font.size", type: "number", default: "11" },
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
      { property: "legend.position", type: '"top" | "bottom" | "right" | "right-top" | "right-center" | "right-bottom"', default: '"bottom"' },
      { property: "legend.gap", type: "number", default: "12", description: "Spacing between legend and chart (px)" },
    ],
  },
  {
    title: "Axis",
    description: "Applies to both x-axis and y-axis.",
    rows: [
      { property: "axis.color", type: "string", default: '"#333333"', description: "Line and tick color" },
      { property: "axis.thickness", type: "number", default: "1", description: "Line thickness (px)" },
      { property: "axis.label.color", type: "string", default: '"#333333"', description: "Label text color" },
      { property: "axis.label.fontSize", type: "number", default: "11", description: "Label font size (px)" },
      { property: "axis.label.gap", type: "number", default: "8", description: "Gap between tick and label (px)" },
      { property: "axis.tick.size", type: "number", default: "6", description: "Tick mark length (px)" },
    ],
  },
  {
    title: "Grid",
    rows: [
      { property: "grid.color", type: "string", default: '"rgba(0, 0, 0, 0.05)"' },
      { property: "grid.thickness", type: "number", default: "1" },
    ],
  },
  {
    title: "Padding",
    description: "Chart area padding in pixels.",
    rows: [
      { property: "padding.top", type: "number", default: "30" },
      { property: "padding.right", type: "number", default: "20" },
      { property: "padding.bottom", type: "number", default: "20" },
      { property: "padding.left", type: "number", default: "60" },
    ],
  },
  {
    title: "Animation",
    rows: [
      { property: "animation.enabled", type: "boolean", default: "true", description: "Enable entry animation" },
      { property: "animation.duration", type: "number", default: "300", description: "Animation duration (ms)" },
      { property: "animation.staggerDelay", type: "number", default: "60", description: "Delay between cells (ms)" },
    ],
  },
  {
    title: "Heatmap",
    description: "Heatmap-specific visual settings.",
    rows: [
      { property: "heatmap.colorRange", type: "[string, string, string]", default: '["#FDE68A", "#F97316", "#B91C1C"]', description: "Color gradient range [low, mid, high]" },
      { property: "heatmap.segment.gap", type: "number", default: "0", description: "Gap between cells (px)" },
    ],
  },
];

export const toastStyle: StylePageData = {
  slug: ["heatmap-chart", "toast"],
  title: toast.title,
  description: `${toast.tagline} — ${toast.inspiration}.`,
  pageType: "style",
  parent: "heatmap-chart",
  styleMeta: {
    tagline: toast.tagline,
    inspiration: toast.inspiration,
    reference: toast.reference,
    features: [
      "Three-color gradient mapping",
      "Configurable cell gap",
      "Animated cell entry",
      "Interactive legend",
      "Axis labels for rows and columns",
    ],
  },
  configSections: heatmapConfigSections,
  examples: [
    {
      title: "Basic Heatmap",
      chart: <BasicHeatmapToast />,
      code: `import ToastHeatmapChart from "./charts/toast-heatmap-chart";
import Widget from "@flitterjs/react";

const chart = ToastHeatmapChart({
  data: {
    xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [
      [2, 5, 8, 12, 18, 24, 28, 30, 25, 16, 9, 4],
      [3, 6, 9, 13, 19, 25, 29, 31, 26, 17, 10, 5],
      [4, 7, 11, 15, 21, 27, 32, 34, 28, 19, 12, 6],
      [5, 8, 12, 16, 22, 28, 33, 35, 29, 20, 13, 7],
      [4, 7, 10, 14, 20, 26, 31, 33, 27, 18, 11, 6],
      [3, 5, 8, 11, 17, 23, 27, 29, 24, 15, 9, 4],
      [2, 4, 7, 10, 16, 22, 26, 28, 23, 14, 8, 3],
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Server Load",
      chart: <ServerLoadToast />,
      code: `import ToastHeatmapChart from "./charts/toast-heatmap-chart";
import Widget from "@flitterjs/react";

const chart = ToastHeatmapChart({
  data: {
    xLabels: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"],
    yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [
      [12, 8, 5, 15, 65, 82, 78, 85, 80, 72, 45, 20],
      [10, 7, 4, 18, 70, 88, 82, 90, 85, 68, 42, 18],
      [14, 9, 6, 20, 72, 85, 80, 88, 82, 70, 48, 22],
      [11, 8, 5, 17, 68, 80, 75, 82, 78, 65, 40, 19],
      [15, 10, 7, 22, 75, 90, 85, 92, 88, 74, 50, 25],
      [8, 5, 3, 10, 25, 35, 40, 38, 32, 28, 20, 12],
      [6, 4, 2, 8, 18, 28, 32, 30, 25, 22, 15, 9],
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Correlation Matrix",
      chart: <CorrelationMatrixToast />,
      code: `import ToastHeatmapChart from "./charts/toast-heatmap-chart";
import Widget from "@flitterjs/react";

const chart = ToastHeatmapChart({
  data: {
    xLabels: ["Rev", "Users", "Sess", "Bounce", "Dur", "Pages"],
    yLabels: ["Rev", "Users", "Sess", "Bounce", "Dur", "Pages"],
    values: [
      [100, 85, 78, -45, 62, 70],
      [85, 100, 92, -52, 58, 75],
      [78, 92, 100, -60, 65, 82],
      [-45, -52, -60, 100, -38, -55],
      [62, 58, 65, -38, 100, 72],
      [70, 75, 82, -55, 72, 100],
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Activity Tracker",
      chart: <GithubActivityToast />,
      code: `import ToastHeatmapChart from "./charts/toast-heatmap-chart";
import Widget from "@flitterjs/react";

const chart = ToastHeatmapChart({
  data: {
    xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [
      [3, 0, 5, 2, 8, 1, 0, 4, 6, 9, 2, 1],
      [0, 7, 3, 0, 2, 5, 1, 0, 8, 3, 0, 4],
      [5, 2, 0, 6, 1, 0, 9, 3, 2, 0, 7, 2],
      [1, 0, 4, 3, 0, 8, 2, 7, 0, 5, 1, 0],
      [0, 3, 1, 0, 5, 2, 0, 1, 4, 0, 3, 6],
      [2, 1, 0, 0, 1, 0, 3, 0, 1, 2, 0, 0],
      [0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0],
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
};
