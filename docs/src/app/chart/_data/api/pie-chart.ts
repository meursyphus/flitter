import type { ApiPageData } from "../types";

export const pieChartApiPage: ApiPageData = {
  slug: ["api", "pie-chart"],
  title: "Pie Chart API",
  description:
    "Complete API reference for the Pie Chart, including data format, configuration options, custom parts, and context methods.",
  pageType: "api",
  parent: "api",
  dataFormat: {
    typeName: "PieChartData",
    typeDefinition: `type PieChartData = {
  datasets: { name: string; value: number }[];
};`,
    description:
      "Each dataset entry represents a slice of the pie with a name and numeric value.",
  },
  agConfig: {
    sections: [
      {
        title: "Pie",
        rows: [
          {
            property: "pie.innerRadiusRatio",
            type: "number",
            default: "0",
            description: "Inner radius ratio (0 = full pie, >0 = donut shape).",
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
            default: "6",
            description: "Gap between the pie and radial labels.",
          },
        ],
      },
      {
        title: "Data Label",
        rows: [
          {
            property: "dataLabel.visible",
            type: "boolean",
            default: "true",
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
            property: "dataLabel.fontWeight",
            type: "string",
            default: '"bold"',
            description: "Data label font weight.",
          },
          {
            property: "dataLabel.radiusRatio",
            type: "number",
            default: "0.65",
            description: "Position of data label as ratio of radius (0 = center, 1 = edge).",
          },
          {
            property: "dataLabel.formatter",
            type: "(args: { index, name, value, percentage, startAngle, sweepAngle }) => string",
            default: '(args) => `${args.percentage.toFixed(1)}%`',
            description: "Formatter function for data label text.",
          },
        ],
      },
      {
        title: "Radial Label",
        rows: [
          {
            property: "radialLabel.fontSize",
            type: "number",
            default: "16",
            description: "Radial label font size.",
          },
          {
            property: "radialLabel.fontColor",
            type: "string",
            default: '"#333333"',
            description: "Radial label text color.",
          },
          {
            property: "radialLabel.fontWeight",
            type: "string",
            default: '"bold"',
            description: "Radial label font weight.",
          },
          {
            property: "radialLabel.nameColor",
            type: "string",
            default: '"#777777"',
            description: "Color for the name portion of the radial label.",
          },
          {
            property: "radialLabel.formatter",
            type: "(args: { index, name, value, percentage, angle }) => string",
            default: "(args) => String(args.value)",
            description: "Formatter function for radial label text.",
          },
        ],
      },
      {
        title: "Radial Tick",
        rows: [
          {
            property: "radialTick.length",
            type: "number",
            default: "14",
            description: "Length of the radial tick line.",
          },
          {
            property: "radialTick.color",
            type: "string",
            default: '"#999999"',
            description: "Radial tick line color.",
          },
          {
            property: "radialTick.strokeWidth",
            type: "number",
            default: "2",
            description: "Radial tick line stroke width.",
          },
        ],
      },
    ],
  },
  toastConfig: {
    sections: [
      {
        title: "Pie",
        rows: [
          {
            property: "pie.innerRadiusRatio",
            type: "number",
            default: "0",
            description: "Inner radius ratio (0 = full pie, >0 = donut shape).",
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
            description: "Gap between the pie and radial labels.",
          },
        ],
      },
      {
        title: "Data Label",
        rows: [
          {
            property: "dataLabel.visible",
            type: "boolean",
            default: "true",
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
            property: "dataLabel.fontWeight",
            type: "string",
            default: '"bold"',
            description: "Data label font weight.",
          },
          {
            property: "dataLabel.radiusRatio",
            type: "number",
            default: "0.65",
            description: "Position of data label as ratio of radius.",
          },
          {
            property: "dataLabel.formatter",
            type: "(args: { index, name, value, percentage, startAngle, sweepAngle }) => string",
            default: '(args) => `${args.percentage.toFixed(1)}%`',
            description: "Formatter function for data label text.",
          },
        ],
      },
      {
        title: "Radial Label",
        rows: [
          {
            property: "radialLabel.fontSize",
            type: "number",
            default: "13",
            description: "Radial label font size.",
          },
          {
            property: "radialLabel.fontColor",
            type: "string",
            default: '"#333333"',
            description: "Radial label text color.",
          },
          {
            property: "radialLabel.fontWeight",
            type: "string",
            default: '"600"',
            description: "Radial label font weight.",
          },
          {
            property: "radialLabel.formatter",
            type: "(args: { index, name, value, percentage, angle }) => string",
            default: "(args) => args.name",
            description: "Formatter function for radial label text.",
          },
        ],
      },
      {
        title: "Radial Tick",
        rows: [
          {
            property: "radialTick.length",
            type: "number",
            default: "18",
            description: "Length of the radial tick line.",
          },
          {
            property: "radialTick.color",
            type: "string",
            default: '"#999999"',
            description: "Radial tick line color.",
          },
          {
            property: "radialTick.strokeWidth",
            type: "number",
            default: "1",
            description: "Radial tick line stroke width.",
          },
        ],
      },
    ],
  },
  customParts: [
    { element: "layout", args: "{ title: Widget; legends: Widget[]; plot: Widget }", description: "Top-level layout composing title, legends, and the plot area." },
    { element: "plot", args: "{ dataView: Widget; tooltipArea: Widget; radialItems: PieChartRadialItem[] }", description: "The plot area with data view, tooltip, and radial items." },
    { element: "dataView", args: "{ segments: PieChartSegment[] }", description: "Container for all pie segments." },
    { element: "segment", args: "{ index: number; name: string; value: number; percentage: number; startAngle: number; sweepAngle: number; dataLabel: Widget; isHovered: boolean }", description: "Individual pie segment/slice." },
    { element: "dataLabel", args: "{ index: number; name: string; value: number; percentage: number; startAngle: number; sweepAngle: number }", description: "Data label on a pie segment." },
    { element: "radialLabel", args: "{ index: number; name: string; value: number; percentage: number; angle: number; isHovered: boolean }", description: "Radial label outside the pie." },
    { element: "radialTick", args: "{ index: number; name: string; value: number; percentage: number; angle: number; isHovered: boolean }", description: "Radial tick line connecting pie to label." },
    { element: "legend", args: "{ name: string; index: number; isVisible: boolean }", description: "Individual legend item." },
    { element: "title", args: "undefined", description: "Chart title element." },
    { element: "tooltip", args: "HoveredPieChartSegment", description: "Tooltip content for a hovered segment." },
    { element: "tooltipArea", args: "{ tooltip: Widget | null; hoveredSegment: HoveredPieChartSegment | null }", description: "Tooltip positioning area." },
  ],
  context: {
    typeName: "PieChartContext",
    properties: [
      { name: "data", type: "PieChartData", description: "Current chart data (filtered by hidden series).", kind: "property" },
      { name: "legends", type: "string[]", description: "All legend names from the raw data.", kind: "property" },
      { name: "width", type: "number", description: "Current chart width in pixels.", kind: "property" },
      { name: "height", type: "number", description: "Current chart height in pixels.", kind: "property" },
      { name: "hiddenSeries", type: "ReadonlySet<string>", description: "Set of currently hidden series names.", kind: "property" },
      { name: "hoveredIndex", type: "number | null", description: "Index of the currently hovered segment.", kind: "property" },
      { name: "config", type: "TConfig", description: "The resolved chart configuration object.", kind: "property" },
      { name: "isSeriesVisible(name)", type: "(name: string) => boolean", description: "Check if a series is currently visible.", kind: "method" },
      { name: "toggleSeries(name)", type: "(name: string) => void", description: "Toggle visibility of a series.", kind: "method" },
      { name: "showSeries(name)", type: "(name: string) => void", description: "Show a hidden series.", kind: "method" },
      { name: "hideSeries(name)", type: "(name: string) => void", description: "Hide a visible series.", kind: "method" },
      { name: "showAllSeries()", type: "() => void", description: "Show all hidden series.", kind: "method" },
      { name: "hoverSegment(index)", type: "(index: number) => void", description: "Set hover state on a segment.", kind: "method" },
      { name: "unhoverSegment(index?)", type: "(index?: number) => void", description: "Clear hover on a segment.", kind: "method" },
      { name: "unhoverAllSegments()", type: "() => void", description: "Clear all segment hover state.", kind: "method" },
      { name: "isSegmentHovered(index)", type: "(index: number) => boolean", description: "Check if a specific segment is hovered.", kind: "method" },
      { name: "setSize(width, height)", type: "(width: number, height: number) => void", description: "Update chart dimensions.", kind: "method" },
    ],
  },
  overrideExample: `import { ToastPieChart } from "@/components/flitter/charts/toast-pie-chart";

<ToastPieChart
  data={data}
  config={{
    radial: { visible: true },
    dataLabel: { visible: false },
  }}
/>`,
};
