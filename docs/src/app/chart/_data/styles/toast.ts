import type { ChartExample, ConfigSection, StylePageData, StyleSummary } from "../types";

/**
 * Toast style brand — shared across all chart types.
 */
export const toast = {
  name: "toast",
  title: "Toast Style",
  tagline: "Pastel tones, smooth staggered animations, hover focus effects",
  inspiration: "Inspired by Toast UI Chart",
  reference: "https://ui.toast.com/tui-chart",
  features: [
    "Soft pastel color palette",
    "Staggered entry animations",
    "Hover focus effect with dimming",
    "Vertical and horizontal directions",
    "Multi-dataset support",
  ],
};

/**
 * Common toast config sections shared across chart types.
 * Chart-specific sections (e.g. "Bar", "Line") should be appended per chart.
 */
export const toastBaseConfigSections: ConfigSection[] = [
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
      { property: "animation.duration", type: "number", default: "300", description: "Duration per bar group (ms)" },
      { property: "animation.staggerDelay", type: "number", default: "60", description: "Delay between groups (ms)" },
    ],
  },
];

/**
 * Create a StyleSummary for toast on a specific chart.
 */
export function toastSummary(
  chartSlug: string,
  chart?: React.ReactNode,
): StyleSummary {
  return {
    slug: [chartSlug, "toast"],
    title: toast.title,
    tagline: toast.tagline,
    inspiration: toast.inspiration,
    reference: toast.reference,
    chart,
  };
}

/**
 * Create a full StylePageData for toast on a specific chart.
 * Pass chart-specific config sections to append after the base ones.
 */
export function toastStylePage(
  chartSlug: string,
  options?: {
    extraConfigSections?: ConfigSection[];
    examples?: ChartExample[];
  },
): StylePageData {
  return {
    slug: [chartSlug, "toast"],
    title: toast.title,
    description: `${toast.tagline} — ${toast.inspiration}.`,
    pageType: "style",
    parent: chartSlug,
    styleMeta: {
      tagline: toast.tagline,
      inspiration: toast.inspiration,
      reference: toast.reference,
      features: [...toast.features],
    },
    configSections: [
      ...toastBaseConfigSections,
      ...(options?.extraConfigSections ?? []),
    ],
    examples: options?.examples,
  };
}
