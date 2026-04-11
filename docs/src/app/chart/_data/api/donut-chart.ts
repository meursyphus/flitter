import type { ApiPageData } from "../types";

export const donutChartApiPage: ApiPageData = {
  slug: ["api", "donut-chart"],
  title: "Donut Chart API",
  description:
    "Complete API reference for the Donut Chart. Uses the donut-chart headless engine (extends pie-chart) with donut-specific configuration including data center display.",
  pageType: "api",
  parent: "api",
  dataFormat: {
    typeName: "DonutChartData",
    typeDefinition: `type DonutChartData = {
  datasets: { name: string; value: number }[];
};`,
    description:
      "Each dataset entry represents a slice of the donut with a name and numeric value. Same format as PieChartData.",
  },
  agConfig: {
    sections: [
      {
        title: "Donut",
        rows: [
          {
            property: "donut.thicknessRatio",
            type: "number",
            default: "0.4",
            description: "Thickness of the donut ring as a ratio (0 to 1). Controls the difference between outer and inner radius.",
          },
        ],
      },
      {
        title: "Pie",
        rows: [
          {
            property: "pie.innerRadiusRatio",
            type: "number",
            default: "0.6",
            description: "Inner radius ratio (auto-computed from thicknessRatio).",
          },
        ],
      },
      {
        title: "Data Center",
        rows: [
          {
            property: "dataCenter.visible",
            type: "boolean",
            default: "false",
            description: "Whether the center label/value display is visible.",
          },
          {
            property: "dataCenter.mode",
            type: '"hovered-or-total" | "total" | "hovered"',
            default: '"hovered-or-total"',
            description: "Display mode for center content.",
          },
          {
            property: "dataCenter.gap",
            type: "number",
            default: "4",
            description: "Gap between label and value text in the center.",
          },
          {
            property: "dataCenter.labelColor",
            type: "string",
            default: '"#6b7280"',
            description: "Color of the center label text.",
          },
          {
            property: "dataCenter.labelFontSize",
            type: "number",
            default: "12",
            description: "Font size of the center label.",
          },
          {
            property: "dataCenter.valueColor",
            type: "string",
            default: '"#181d1f"',
            description: "Color of the center value text.",
          },
          {
            property: "dataCenter.valueFontSize",
            type: "number",
            default: "24",
            description: "Font size of the center value.",
          },
          {
            property: "dataCenter.valueFontWeight",
            type: "string",
            default: '"700"',
            description: "Font weight of the center value.",
          },
          {
            property: "dataCenter.formatter",
            type: "(args: { total, hoveredSegment, mode }) => { label: string; value: string }",
            default: 'Shows hovered name/value or "Total"',
            description: "Formatter function for center display content.",
          },
        ],
      },
      {
        title: "Radial",
        rows: [
          {
            property: "radial.visible",
            type: "boolean",
            default: "true",
            description: "Whether radial labels and ticks are visible.",
          },
          {
            property: "radial.gap",
            type: "number",
            default: "6",
            description: "Gap between the donut and radial labels.",
          },
        ],
      },
      {
        title: "Data Label",
        rows: [
          {
            property: "dataLabel.visible",
            type: "boolean",
            default: "false",
            description: "Whether data labels on slices are visible.",
          },
          {
            property: "dataLabel.fontSize",
            type: "number",
            default: "12",
            description: "Data label font size.",
          },
          {
            property: "dataLabel.fontColor",
            type: "string",
            default: '"white"',
            description: "Data label text color.",
          },
          {
            property: "dataLabel.radiusRatio",
            type: "number",
            default: "0.65",
            description: "Position of data label as ratio of radius.",
          },
        ],
      },
    ],
  },
  toastConfig: {
    sections: [
      {
        title: "Donut",
        rows: [
          {
            property: "donut.thicknessRatio",
            type: "number",
            default: "0.4",
            description: "Thickness of the donut ring as a ratio (0 to 1).",
          },
        ],
      },
      {
        title: "Pie",
        rows: [
          {
            property: "pie.innerRadiusRatio",
            type: "number",
            default: "0.6",
            description: "Inner radius ratio (auto-computed from thicknessRatio).",
          },
        ],
      },
      {
        title: "Data Center",
        rows: [
          {
            property: "dataCenter.visible",
            type: "boolean",
            default: "false",
            description: "Whether the center label/value display is visible.",
          },
          {
            property: "dataCenter.mode",
            type: '"hovered-or-total" | "total" | "hovered"',
            default: '"hovered-or-total"',
            description: "Display mode for center content.",
          },
          {
            property: "dataCenter.gap",
            type: "number",
            default: "2",
            description: "Gap between label and value text in the center.",
          },
          {
            property: "dataCenter.labelColor",
            type: "string",
            default: '"#9ca3af"',
            description: "Color of the center label text.",
          },
          {
            property: "dataCenter.labelFontSize",
            type: "number",
            default: "11",
            description: "Font size of the center label.",
          },
          {
            property: "dataCenter.valueColor",
            type: "string",
            default: '"#111827"',
            description: "Color of the center value text.",
          },
          {
            property: "dataCenter.valueFontSize",
            type: "number",
            default: "22",
            description: "Font size of the center value.",
          },
          {
            property: "dataCenter.valueFontWeight",
            type: "string",
            default: '"700"',
            description: "Font weight of the center value.",
          },
          {
            property: "dataCenter.formatter",
            type: "(args: { total, hoveredSegment, mode }) => { label: string; value: string }",
            default: 'Shows hovered name/value or "Total"',
            description: "Formatter function for center display content.",
          },
        ],
      },
      {
        title: "Radial",
        rows: [
          {
            property: "radial.visible",
            type: "boolean",
            default: "false",
            description: "Whether radial labels and ticks are visible.",
          },
          {
            property: "radial.gap",
            type: "number",
            default: "8",
            description: "Gap between the donut and radial labels.",
          },
        ],
      },
      {
        title: "Data Label",
        rows: [
          {
            property: "dataLabel.visible",
            type: "boolean",
            default: "false",
            description: "Whether data labels on slices are visible.",
          },
          {
            property: "dataLabel.fontSize",
            type: "number",
            default: "14",
            description: "Data label font size.",
          },
          {
            property: "dataLabel.fontColor",
            type: "string",
            default: '"white"',
            description: "Data label text color.",
          },
          {
            property: "dataLabel.radiusRatio",
            type: "number",
            default: "0.65",
            description: "Position of data label as ratio of radius.",
          },
        ],
      },
    ],
  },
  customParts: [
    { element: "layout", args: "{ title: Widget; legends: Widget[]; plot: Widget }", description: "Top-level layout composing title, legends, and the plot area." },
    { element: "plot", args: "{ dataView: Widget; tooltipArea: Widget; radialItems: DonutChartRadialItem[] }", description: "The plot area with data view, tooltip, and radial items." },
    { element: "dataView", args: "{ segments: DonutChartSegment[]; dataCenter: Widget }", description: "Container for all donut segments and the center display." },
    { element: "segment", args: "{ index: number; name: string; value: number; percentage: number; startAngle: number; sweepAngle: number; dataLabel: Widget; isHovered: boolean }", description: "Individual donut segment/slice." },
    { element: "dataLabel", args: "{ index: number; name: string; value: number; percentage: number; startAngle: number; sweepAngle: number }", description: "Data label on a donut segment." },
    { element: "dataCenter", args: "{ total: number; hoveredSegment: DonutChartSegmentArgs | null }", description: "Center display showing total or hovered segment info." },
    { element: "radialLabel", args: "{ index: number; name: string; value: number; percentage: number; angle: number; isHovered: boolean }", description: "Radial label outside the donut." },
    { element: "radialTick", args: "{ index: number; name: string; value: number; percentage: number; angle: number; isHovered: boolean }", description: "Radial tick line connecting donut to label." },
    { element: "legend", args: "{ name: string; index: number; isVisible: boolean }", description: "Individual legend item." },
    { element: "title", args: "undefined", description: "Chart title element." },
    { element: "tooltip", args: "HoveredDonutChartSegment", description: "Tooltip content for a hovered segment." },
    { element: "tooltipArea", args: "{ tooltip: Widget | null; hoveredSegment: HoveredDonutChartSegment | null }", description: "Tooltip positioning area." },
  ],
  context: {
    typeName: "DonutChartContext",
    properties: [
      { name: "data", type: "DonutChartData", description: "Current chart data (filtered by hidden series).", kind: "property" },
      { name: "legends", type: "string[]", description: "All legend names from the raw data.", kind: "property" },
      { name: "width", type: "number", description: "Current chart width in pixels.", kind: "property" },
      { name: "height", type: "number", description: "Current chart height in pixels.", kind: "property" },
      { name: "hiddenSeries", type: "ReadonlySet<string>", description: "Set of currently hidden series names.", kind: "property" },
      { name: "hoveredIndex", type: "number | null", description: "Index of the currently hovered segment.", kind: "property" },
      { name: "config", type: "TConfig", description: "The resolved chart configuration object.", kind: "property" },
      { name: "isSeriesVisible(name)", type: "(name: string) => boolean", description: "Check if a series is currently visible.", kind: "method" },
      { name: "toggleSeries(name)", type: "(name: string) => void", description: "Toggle visibility of a series.", kind: "method" },
      { name: "showAllSeries()", type: "() => void", description: "Show all hidden series.", kind: "method" },
      { name: "hoverSegment(index)", type: "(index: number) => void", description: "Set hover state on a segment.", kind: "method" },
      { name: "unhoverSegment(index?)", type: "(index?: number) => void", description: "Clear hover on a segment.", kind: "method" },
      { name: "unhoverAllSegments()", type: "() => void", description: "Clear all segment hover state.", kind: "method" },
      { name: "isSegmentHovered(index)", type: "(index: number) => boolean", description: "Check if a specific segment is hovered.", kind: "method" },
      { name: "setSize(width, height)", type: "(width: number, height: number) => void", description: "Update chart dimensions.", kind: "method" },
    ],
  },
  overrideExample: `import { ToastDonutChart } from "@/components/flitter/charts/toast-donut-chart";

<ToastDonutChart
  data={data}
  config={{
    donut: { thicknessRatio: 0.3 },
    dataCenter: { visible: true },
  }}
/>`,
};
