import type { StylePageData, ConfigSection } from "../../types";
import { toast } from "../../styles/toast";
import { BasicHeatmapChart } from "./examples";

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
    { title: "Basic Heatmap", chart: <BasicHeatmapChart /> },
  ],
};
