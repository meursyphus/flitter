import type { ApiPageData } from "../types";

export const heatmapChartApiPage: ApiPageData = {
  slug: ["api", "heatmap-chart"],
  title: "Heatmap Chart API",
  description:
    "Complete API reference for the Heatmap Chart, including data format, configuration options, custom parts, and context methods.",
  pageType: "api",
  parent: "api",
  dataFormat: {
    typeName: "HeatmapData",
    typeDefinition: `type HeatmapData = {
  xLabels: string[];
  yLabels: string[];
  // segments are 2-dimensional array [yIndex][xIndex]
  values: number[][];
};`,
    description:
      "A matrix of values indexed by x-labels (columns) and y-labels (rows). Values[yIndex][xIndex] represents the intensity at that cell.",
  },
  agConfig: {
    sections: [
      {
        title: "Heatmap",
        rows: [
          {
            property: "heatmap.colorRange",
            type: "[string, string, string]",
            default: '["#1D4ED8", "#FDE047", "#DC2626"]',
            description: "Three-color gradient range [low, mid, high] for mapping values.",
          },
          {
            property: "heatmap.segment.gap",
            type: "number",
            default: "0",
            description: "Gap between heatmap cells in pixels.",
          },
        ],
      },
    ],
  },
  toastConfig: {
    sections: [
      {
        title: "Heatmap",
        rows: [
          {
            property: "heatmap.colorRange",
            type: "[string, string, string]",
            default: '["#FDE68A", "#F97316", "#B91C1C"]',
            description: "Three-color gradient range [low, mid, high] for mapping values.",
          },
          {
            property: "heatmap.segment.gap",
            type: "number",
            default: "0",
            description: "Gap between heatmap cells in pixels.",
          },
        ],
      },
    ],
  },
  customParts: [
    { element: "layout", args: "{ title: Widget; legend: Widget; plot: Widget }", description: "Top-level layout composing title, legend, and the plot area." },
    { element: "plot", args: "{ xAxis: Widget; yAxis: Widget; dataView: Widget; axisCorner: Widget; tooltipArea: Widget }", description: "The plot area composing axes, data view, and tooltip." },
    { element: "xAxis", args: "{ line: Widget; labels: Widget[]; tick: Widget }", description: "The complete x-axis assembly." },
    { element: "yAxis", args: "{ line: Widget; labels: Widget[]; tick: Widget }", description: "The complete y-axis assembly." },
    { element: "xAxisLabel", args: "{ name: string; index: number }", description: "Individual x-axis label." },
    { element: "yAxisLabel", args: "{ name: string; index: number }", description: "Individual y-axis label." },
    { element: "xAxisLine", args: "undefined", description: "X-axis line." },
    { element: "yAxisLine", args: "undefined", description: "Y-axis line." },
    { element: "axisCorner", args: "undefined", description: "Corner element where x and y axes meet." },
    { element: "xAxisTick", args: "undefined", description: "X-axis tick mark." },
    { element: "yAxisTick", args: "undefined", description: "Y-axis tick mark." },
    { element: "dataView", args: "{ segments: Widget[][] }", description: "Container for all heatmap cells (2D array)." },
    { element: "segment", args: "{ value: number; xIndex: number; yIndex: number; isHovered: boolean }", description: "Individual heatmap cell." },
    { element: "legend", args: "undefined", description: "Color scale legend element." },
    { element: "title", args: "undefined", description: "Chart title element." },
    { element: "tooltip", args: "{ label: string; items: { legend: string; color: string; value: number }[] }", description: "Tooltip content widget." },
    { element: "tooltipArea", args: "{ tooltip: Widget | null; hoveredSegment: HeatmapHoveredSegmentRect | null }", description: "Tooltip positioning area." },
  ],
  context: {
    typeName: "HeatmapContext",
    properties: [
      { name: "data", type: "HeatmapData", description: "Current chart data.", kind: "property" },
      { name: "width", type: "number", description: "Current chart width in pixels.", kind: "property" },
      { name: "height", type: "number", description: "Current chart height in pixels.", kind: "property" },
      { name: "scale", type: "HeatmapScale", description: "Computed scale with min and max values.", kind: "property" },
      { name: "hoveredSegment", type: "HeatmapHoveredSegment | null", description: "Currently hovered cell info.", kind: "property" },
      { name: "config", type: "TConfig", description: "The resolved chart configuration object.", kind: "property" },
      { name: "hoverSegment(xIndex, yIndex, anchorKey)", type: "(xIndex: number, yIndex: number, anchorKey: GlobalKey) => void", description: "Set hover state on a cell.", kind: "method" },
      { name: "unhoverSegment(xIndex, yIndex)", type: "(xIndex: number, yIndex: number) => void", description: "Clear hover if the specified cell is currently hovered.", kind: "method" },
      { name: "unhoverAllSegments()", type: "() => void", description: "Clear all cell hover state.", kind: "method" },
      { name: "isSegmentHovered(xIndex, yIndex)", type: "(xIndex: number, yIndex: number) => boolean", description: "Check if a specific cell is hovered.", kind: "method" },
      { name: "setSize(width, height)", type: "(width: number, height: number) => void", description: "Update chart dimensions.", kind: "method" },
    ],
  },
  overrideExample: `import { ToastHeatmapChart } from "@/components/flitter/charts/toast-heatmap-chart";

<ToastHeatmapChart
  data={data}
  config={{
    heatmap: {
      colorRange: ["#dbeafe", "#3b82f6", "#1e3a5f"],
      segment: { gap: 2 },
    },
  }}
/>`,
};
