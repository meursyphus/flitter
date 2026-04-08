import type { ApiPageData } from "../types";

export const scatterChartApiPage: ApiPageData = {
  slug: ["api", "scatter-chart"],
  title: "Scatter Chart API",
  description:
    "Complete API reference for the Scatter Chart, including data format, configuration options, custom parts, and context methods.",
  pageType: "api",
  parent: "api",
  dataFormat: {
    typeName: "ScatterChartData",
    typeDefinition: `type ScatterChartData = {
  datasets: {
    legend: string;
    data: { x: number; y: number; label: string }[];
  }[];
};`,
    description:
      "Each dataset contains a series of x/y data points with labels.",
  },
  agConfig: {
    sections: [
      {
        title: "Scatter",
        rows: [
          {
            property: "scatter.size",
            type: "number",
            default: "10",
            description: "Diameter of scatter point in pixels.",
          },
          {
            property: "scatter.strokeWidth",
            type: "number",
            default: "2",
            description: "Stroke width of the scatter point border.",
          },
        ],
      },
    ],
  },
  toastConfig: {
    sections: [
      {
        title: "Scatter",
        rows: [
          {
            property: "scatter.size",
            type: "number",
            default: "10",
            description: "Diameter of scatter point in pixels.",
          },
          {
            property: "scatter.fill",
            type: "boolean",
            default: "false",
            description: "Whether scatter points are filled or outlined.",
          },
          {
            property: "scatter.strokeWidth",
            type: "number",
            default: "2",
            description: "Stroke width of the scatter point border.",
          },
        ],
      },
    ],
  },
  customParts: [
    { element: "scatter", args: "{ label: string; legend: string; index: number; isHovered: boolean }", description: "Individual scatter point element." },
    { element: "xAxis", args: "{ line: Widget; labels: Widget[]; tick: Widget }", description: "The complete x-axis assembly." },
    { element: "yAxis", args: "{ line: Widget; labels: Widget[]; tick: Widget }", description: "The complete y-axis assembly." },
    { element: "xAxisLabel", args: "{ name: string; index: number }", description: "Individual x-axis label." },
    { element: "yAxisLabel", args: "{ name: string; index: number }", description: "Individual y-axis label." },
    { element: "xAxisTick", args: "undefined", description: "X-axis tick mark." },
    { element: "yAxisTick", args: "undefined", description: "Y-axis tick mark." },
    { element: "xAxisLine", args: "undefined", description: "X-axis line." },
    { element: "yAxisLine", args: "undefined", description: "Y-axis line." },
    { element: "axisCorner", args: "undefined", description: "Corner element where x and y axes meet." },
    { element: "dataView", args: "{ scatters: { widget: Widget; x: number; y: number }[]; scale: ScatterChartScale }", description: "Container for all scatter points." },
    { element: "layout", args: "{ title: Widget; legends: Widget[]; plot: Widget }", description: "Top-level layout composing title, legends, and the plot area." },
    { element: "plot", args: "{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget }", description: "The plot area composing axes, data view, and grid." },
    { element: "legend", args: "{ name: string; index: number; isVisible: boolean }", description: "Individual legend item." },
    { element: "title", args: "undefined", description: "Chart title element." },
    { element: "dataLabel", args: "{ x: number; y: number; value: number; label: string; legend: string }", description: "Data label at a scatter point." },
    { element: "grid", args: "{ xLine: Widget; yLine: Widget }", description: "Grid container." },
    { element: "gridXLine", args: "undefined", description: "Individual vertical grid line." },
    { element: "gridYLine", args: "undefined", description: "Individual horizontal grid line." },
    { element: "tooltip", args: "{ label: string; items: { legend: string; color: string; value: number }[] }", description: "Tooltip content widget." },
  ],
  context: {
    typeName: "ScatterChartContext",
    properties: [
      { name: "data", type: "ScatterChartData", description: "Current chart data (filtered by hidden series).", kind: "property" },
      { name: "legends", type: "string[]", description: "All legend names from the raw data.", kind: "property" },
      { name: "width", type: "number", description: "Current chart width in pixels.", kind: "property" },
      { name: "height", type: "number", description: "Current chart height in pixels.", kind: "property" },
      { name: "scale", type: "ScatterChartScale | null", description: "Computed scale with x and y ranges.", kind: "property" },
      { name: "hiddenSeries", type: "ReadonlySet<string>", description: "Set of currently hidden series.", kind: "property" },
      { name: "hoveredPoint", type: "{ index: number; legend: string } | null", description: "Currently hovered point info.", kind: "property" },
      { name: "config", type: "TConfig", description: "The resolved chart configuration object.", kind: "property" },
      { name: "isSeriesVisible(legend)", type: "(legend: string) => boolean", description: "Check if a series is currently visible.", kind: "method" },
      { name: "toggleSeries(legend)", type: "(legend: string) => void", description: "Toggle visibility of a series.", kind: "method" },
      { name: "showSeries(legend)", type: "(legend: string) => void", description: "Show a hidden series.", kind: "method" },
      { name: "hideSeries(legend)", type: "(legend: string) => void", description: "Hide a visible series.", kind: "method" },
      { name: "showAllSeries()", type: "() => void", description: "Show all hidden series.", kind: "method" },
      { name: "hoverPoint(index, legend)", type: "(index: number, legend: string) => void", description: "Set hover state on a point.", kind: "method" },
      { name: "unhoverPoint(index, legend)", type: "(index: number, legend: string) => void", description: "Clear hover on a point.", kind: "method" },
      { name: "unhoverAllPoints()", type: "() => void", description: "Clear all point hover state.", kind: "method" },
      { name: "isPointHovered(index, legend)", type: "(index: number, legend: string) => boolean", description: "Check if a specific point is hovered.", kind: "method" },
      { name: "setSize(width, height)", type: "(width: number, height: number) => void", description: "Update chart dimensions.", kind: "method" },
    ],
  },
  overrideExample: `import { ToastScatterChart } from "@/components/flitter/charts/toast-scatter-chart";

<ToastScatterChart
  data={data}
  config={{
    scatter: { size: 14, fill: true },
  }}
/>`,
};
