import type { StylePageData, ConfigSection } from "../../types";
import { toast } from "../../styles/toast";
import { BasicPieChart, DonutPieChart } from "./examples";

const pieConfigSections: ConfigSection[] = [
  {
    title: "Colors",
    description:
      "Slice color palette. Colors cycle automatically when datasets exceed palette length.",
    rows: [
      {
        property: "colors",
        type: "string[]",
        default: '["#00a9ff", "#ffb840", ...]',
        description: "Color palette for pie slices",
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
      { property: "animation.staggerDelay", type: "number", default: "60", description: "Delay between slices (ms)" },
    ],
  },
  {
    title: "Pie",
    description: "Pie-specific visual settings.",
    rows: [
      { property: "pie.strokeColor", type: "string", default: '"white"', description: "Border color between slices" },
      { property: "pie.strokeWidth", type: "number", default: "2", description: "Border width between slices (px)" },
      { property: "pie.innerRadiusRatio", type: "number", default: "0", description: "Inner radius ratio (0 = pie, 0.5 = donut)" },
    ],
  },
];

export const toastStyle: StylePageData = {
  slug: ["pie-chart", "toast"],
  title: toast.title,
  description: `${toast.tagline} — ${toast.inspiration}.`,
  pageType: "style",
  parent: "pie-chart",
  styleMeta: {
    tagline: toast.tagline,
    inspiration: toast.inspiration,
    reference: toast.reference,
    features: [
      "Soft pastel color palette",
      "Smooth slice entry animations",
      "Interactive legend with series toggle",
      "Donut variant via innerRadiusRatio",
      "Configurable slice borders",
    ],
  },
  configSections: pieConfigSections,
  examples: [
    { title: "Basic Pie", chart: <BasicPieChart /> },
    { title: "Donut", chart: <DonutPieChart /> },
  ],
};
