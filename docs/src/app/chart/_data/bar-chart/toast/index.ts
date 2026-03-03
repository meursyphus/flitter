import type { StylePageData, ConfigSection } from "../../types";

const configCode = `BarChart({
  style: "toast",
  data: { /* ... */ },
  config: {
    colors: ["#6366f1", "#10b981"],
    bar: { cornerRadius: 4 },
    animation: { duration: 500 },
  },
});`;

const fullConfigType = `type ToastBarChartConfig = {
  /** Color palette for dataset series — cycles automatically when datasets exceed palette length */
  colors: string[];
  /** Base typography applied to axis labels and legend text */
  font: {
    family: string;  // default: "Noto Sans JP"
    size: number;    // default: 11
  };
  /** Chart title configuration */
  title: {
    visible: boolean;                          // default: true
    color: string;                             // default: "#000000"
    fontSize: number;                          // default: 16
    fontFamily?: string;                       // overrides font.family
    fontWeight?: string;                       // default: "bold"
    position: "top" | "bottom";                // default: "top"
    alignment: "start" | "center" | "end";     // default: "center"
  };
  /** Legend display options */
  legend: {
    visible: boolean;                // default: true
    position: "top" | "bottom";      // default: "bottom"
  };
  /** Axis styling — applies to both x-axis and y-axis */
  axis: {
    color: string;       // line and tick color, default: "#BBBBBB"
    thickness: number;   // line thickness in px, default: 1
    label: {
      color: string;     // default: "#666666"
      fontSize: number;  // default: 11
      gap: number;       // gap between tick and label in px, default: 8
    };
    tick: {
      size: number;      // tick mark length in px, default: 6
    };
  };
  /** Grid lines behind the chart area */
  grid: {
    color: string;       // default: "#EEEEEE"
    thickness: number;   // default: 1
  };
  /** Chart area padding in pixels */
  padding: {
    top: number;     // default: 30
    right: number;   // default: 20
    bottom: number;  // default: 40
    left: number;    // default: 60
  };
  /** Bar appearance */
  bar: {
    gap: number;          // margin between bars in a group (px), default: 1
    cornerRadius: number; // bar corner radius (px), default: 0
  };
  /** Entry animation settings */
  animation: {
    enabled: boolean;      // default: true
    duration: number;      // duration per bar group in ms, default: 300
    staggerDelay: number;  // delay between groups in ms, default: 60
  };
};`;

const examples: { title: string; code: string }[] = [
  {
    title: "Multi-Dataset",
    code: `BarChart({
  style: "toast",
  title: "Quarterly Comparison",
  data: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      { legend: "2024", values: [150, 200, 180, 220] },
      { legend: "2025", values: [170, 210, 240, 260] },
    ],
  },
  config: {
    colors: ["#6366f1", "#10b981"],
  },
});`,
  },
  {
    title: "Horizontal Direction",
    code: `BarChart({
  style: "toast",
  direction: "horizontal",
  data: {
    labels: ["Marketing", "Engineering", "Design", "Sales"],
    datasets: [
      { legend: "Headcount", values: [12, 28, 8, 15] },
    ],
  },
  config: {
    colors: ["#f59e0b"],
  },
});`,
  },
  {
    title: "Rounded Bars",
    code: `BarChart({
  style: "toast",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      { legend: "Steps", values: [8000, 12000, 6500, 9200, 11000] },
    ],
  },
  config: {
    colors: ["#8b5cf6"],
    bar: { cornerRadius: 4, gap: 2 },
  },
});`,
  },
];

const configSections: ConfigSection[] = [
  {
    title: "Colors",
    description:
      "Series color palette. Colors cycle automatically when datasets exceed palette length.",
    rows: [
      {
        property: "colors",
        type: "string[]",
        default: '["#00a9ff", "#ffb840", ...]',
        description: "Color palette for dataset series",
      },
    ],
  },
  {
    title: "Font",
    description: "Base typography applied to axis labels and legend text.",
    rows: [
      { property: "font.family", type: "string", default: '"Noto Sans JP"' },
      { property: "font.size", type: "number", default: "11" },
    ],
  },
  {
    title: "Title",
    rows: [
      { property: "title.visible", type: "boolean", default: "true", description: "Show or hide the title" },
      { property: "title.color", type: "string", default: '"#000000"', description: "Text color" },
      { property: "title.fontSize", type: "number", default: "16", description: "Font size in px" },
      { property: "title.fontFamily", type: "string?", default: "\u2014", description: "Overrides font.family" },
      { property: "title.fontWeight", type: "string?", default: '"bold"', description: "Font weight" },
      { property: "title.position", type: '"top" | "bottom"', default: '"top"', description: "Placement relative to chart" },
      { property: "title.alignment", type: '"start" | "center" | "end"', default: '"center"', description: "Horizontal alignment" },
    ],
  },
  {
    title: "Legend",
    rows: [
      { property: "legend.visible", type: "boolean", default: "true" },
      { property: "legend.position", type: '"top" | "bottom"', default: '"bottom"' },
    ],
  },
  {
    title: "Axis",
    description: "Applies to both x-axis and y-axis.",
    rows: [
      { property: "axis.color", type: "string", default: '"#BBBBBB"', description: "Line and tick color" },
      { property: "axis.thickness", type: "number", default: "1", description: "Line thickness (px)" },
      { property: "axis.label.color", type: "string", default: '"#666666"', description: "Label text color" },
      { property: "axis.label.fontSize", type: "number", default: "11", description: "Label font size (px)" },
      { property: "axis.label.gap", type: "number", default: "8", description: "Gap between tick and label (px)" },
      { property: "axis.tick.size", type: "number", default: "6", description: "Tick mark length (px)" },
    ],
  },
  {
    title: "Grid",
    rows: [
      { property: "grid.color", type: "string", default: '"#EEEEEE"' },
      { property: "grid.thickness", type: "number", default: "1" },
    ],
  },
  {
    title: "Padding",
    description: "Chart area padding in pixels.",
    rows: [
      { property: "padding.top", type: "number", default: "30" },
      { property: "padding.right", type: "number", default: "20" },
      { property: "padding.bottom", type: "number", default: "40" },
      { property: "padding.left", type: "number", default: "60" },
    ],
  },
  {
    title: "Bar",
    rows: [
      { property: "bar.gap", type: "number", default: "1", description: "Horizontal margin between bars in a group (px)" },
      { property: "bar.cornerRadius", type: "number", default: "0", description: "Bar corner radius (px)" },
    ],
  },
  {
    title: "Animation",
    rows: [
      { property: "animation.enabled", type: "boolean", default: "true", description: "Enable entry animation" },
      { property: "animation.duration", type: "number", default: "300", description: "Duration per bar group (ms)" },
      { property: "animation.staggerDelay", type: "number", default: "60", description: "Delay between groups (ms)" },
    ],
  },
];

export function toastStyle(basicCode: string): StylePageData {
  return {
    slug: ["bar-chart", "toast"],
    title: "Toast Style",
    description:
      "Clean, minimal bar chart with smooth staggered entry animations.",
    pageType: "style",
    parent: "bar-chart",
    styleMeta: {
      tagline: "Clean, minimal, smooth animations",
      inspiration: "Inspired by Toast UI Chart",
      features: [
        "Staggered entry animations",
        "Vertical and horizontal directions",
        "Multi-dataset support",
        "Configurable colors, fonts, padding",
      ],
    },
    code: {
      basic: basicCode,
      config: configCode,
      fullConfigType,
      examples,
    },
    configSections,
  };
}

