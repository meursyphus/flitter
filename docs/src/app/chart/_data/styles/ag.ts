import type { ChartExample, ConfigSection, StylePageData, StyleSummary } from "../types";

/**
 * AG style brand — shared across all chart types.
 */
export const ag = {
  name: "ag",
  title: "AG Style",
  tagline: "Professional, data-dense, enterprise-ready",
  inspiration: "Inspired by AG Charts",
  features: [
    "Opacity-based hover effects",
    "Subtitle support",
    "Dashed grid lines",
    "Mouse-following tooltips with arrow",
    "Flexible legend positioning (top, bottom, right variants)",
    "Configurable axis line & grid visibility per direction",
  ],
};

/**
 * Common AG config sections shared across chart types.
 * Chart-specific sections (e.g. "Bar", "Line") should be appended per chart.
 */
export const agBaseConfigSections: ConfigSection[] = [
  {
    title: "Colors",
    description:
      "Series color palette with separate fill and stroke arrays. Colors cycle automatically.",
    rows: [
      {
        property: "colors.fills",
        type: "string[]",
        default: '["#5090dc", "#ffa03a", ...]',
        description: "Fill color palette for series",
      },
      {
        property: "colors.strokes",
        type: "string[]",
        default: '["#2b6cb5", "#cc7a1e", ...]',
        description: "Stroke color palette for series outlines",
      },
    ],
  },
  {
    title: "Background",
    rows: [
      { property: "background", type: "string", default: '"white"', description: "Chart background color" },
    ],
  },
  {
    title: "Font",
    description: "Base typography applied to axis labels and legend text.",
    rows: [
      { property: "font.family", type: "string", default: '"Verdana, sans-serif"' },
      { property: "font.size", type: "number", default: "13" },
    ],
  },
  {
    title: "Title",
    rows: [
      { property: "title.visible", type: "boolean", default: "true", description: "Show or hide the title" },
      { property: "title.text", type: "string", default: '""', description: "Title text" },
      { property: "title.color", type: "string", default: '"#181d1f"', description: "Text color" },
      { property: "title.fontSize", type: "number", default: "18", description: "Font size in px" },
      { property: "title.fontFamily", type: "string?", default: "\u2014", description: "Overrides font.family" },
      { property: "title.fontWeight", type: "string?", default: '"bold"', description: "Font weight" },
      { property: "title.position", type: '"top" | "bottom"', default: '"top"', description: "Placement relative to chart" },
      { property: "title.alignment", type: '"start" | "center" | "end"', default: '"start"', description: "Horizontal alignment" },
    ],
  },
  {
    title: "Subtitle",
    rows: [
      { property: "subtitle.visible", type: "boolean", default: "false", description: "Show or hide subtitle" },
      { property: "subtitle.text", type: "string", default: '""', description: "Subtitle text" },
      { property: "subtitle.color", type: "string", default: '"#8d949a"', description: "Text color" },
      { property: "subtitle.fontSize", type: "number", default: "14", description: "Font size in px" },
      { property: "subtitle.fontFamily", type: "string?", default: "\u2014", description: "Overrides font.family" },
      { property: "subtitle.fontWeight", type: "string?", default: "\u2014", description: "Font weight" },
    ],
  },
  {
    title: "Legend",
    rows: [
      { property: "legend.visible", type: "boolean", default: "true" },
      { property: "legend.position", type: '"top" | "bottom" | "right" | "right-top" | "right-center" | "right-bottom"', default: '"bottom"' },
      { property: "legend.gap", type: "number", default: "16", description: "Spacing between legend items (px)" },
      { property: "legend.color", type: "string", default: '"#585858"', description: "Legend text color" },
    ],
  },
  {
    title: "Axis",
    description: "Applies to both x-axis and y-axis.",
    rows: [
      { property: "axis.color", type: "string", default: '"#8a8c8c"', description: "Line and tick color" },
      { property: "axis.thickness", type: "number", default: "1", description: "Line thickness (px)" },
      { property: "axis.label.color", type: "string", default: '"#585858"', description: "Label text color" },
      { property: "axis.label.fontSize", type: "number", default: "13", description: "Label font size (px)" },
      { property: "axis.label.gap", type: "number", default: "11", description: "Gap between axis and label (px)" },
      { property: "axis.tick.enabled", type: "boolean", default: "false", description: "Show tick marks" },
      { property: "axis.tick.size", type: "number", default: "6", description: "Tick mark length (px)" },
      { property: "axis.xLine.visible", type: "boolean", default: "true", description: "Show x-axis line" },
      { property: "axis.yLine.visible", type: "boolean", default: "true", description: "Show y-axis line" },
    ],
  },
  {
    title: "Grid",
    rows: [
      { property: "grid.color", type: "string", default: '"#e2e2e2"' },
      { property: "grid.thickness", type: "number", default: "1" },
      { property: "grid.dash", type: "number[]", default: "[]", description: "Dash pattern (e.g. [4, 2])" },
      { property: "grid.xLine.visible", type: "boolean", default: "false", description: "Show horizontal grid lines" },
      { property: "grid.yLine.visible", type: "boolean", default: "true", description: "Show vertical grid lines" },
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
    title: "Tooltip",
    rows: [
      { property: "tooltip.enabled", type: "boolean", default: "true", description: "Enable tooltips" },
      { property: "tooltip.backgroundColor", type: "string", default: '"white"', description: "Background color" },
      { property: "tooltip.textColor", type: "string", default: '"#181d1f"', description: "Text color" },
      { property: "tooltip.borderColor", type: "string", default: '"#e2e2e2"', description: "Border color" },
      { property: "tooltip.borderRadius", type: "number", default: "4", description: "Corner radius (px)" },
      { property: "tooltip.padding", type: "number", default: "12", description: "Internal padding (px)" },
    ],
  },
];

/**
 * Create a StyleSummary for AG on a specific chart.
 */
export function agSummary(
  chartSlug: string,
  chart?: React.ReactNode,
): StyleSummary {
  return {
    slug: [chartSlug, "ag"],
    title: ag.title,
    tagline: ag.tagline,
    inspiration: ag.inspiration,
    chart,
  };
}

/**
 * Create a full StylePageData for AG on a specific chart.
 */
export function agStylePage(
  chartSlug: string,
  options?: {
    extraConfigSections?: ConfigSection[];
    examples?: ChartExample[];
  },
): StylePageData {
  return {
    slug: [chartSlug, "ag"],
    title: ag.title,
    description: `${ag.tagline} — ${ag.inspiration}.`,
    pageType: "style",
    parent: chartSlug,
    styleMeta: {
      tagline: ag.tagline,
      inspiration: ag.inspiration,
      features: [...ag.features],
    },
    configSections: [
      ...agBaseConfigSections,
      ...(options?.extraConfigSections ?? []),
    ],
    examples: options?.examples,
  };
}
