import type { ApiPageData } from "../types";

export const areaChartApiPage: ApiPageData = {
  slug: ["api", "area-chart"],
  title: "Area Chart API",
  description:
    "Complete API reference for the Area Chart. Uses the line-chart headless engine with area-specific configuration.",
  pageType: "api",
  parent: "api",
  dataFormat: {
    typeName: "LineChartData",
    typeDefinition: `type LineChartData = {
  labels: string[];
  datasets: { legend: string; values: number[] }[];
};`,
    description:
      "Area Chart reuses the LineChartData format. Each dataset represents an area series with a legend name and values.",
  },
  agConfig: {
    sections: [
      {
        title: "Area",
        rows: [
          {
            property: "area.strokeWidth",
            type: "number",
            default: "2",
            description: "Stroke width of the area border line.",
          },
          {
            property: "area.opacity",
            type: "number",
            default: "0.3",
            description: "Fill opacity of the area (0 to 1).",
          },
          {
            property: "area.spline",
            type: "boolean",
            default: "false",
            description: "Whether to use spline (smooth curve) interpolation.",
          },
        ],
      },
    ],
  },
  toastConfig: {
    sections: [
      {
        title: "Area",
        rows: [
          {
            property: "area.strokeWidth",
            type: "number",
            default: "2",
            description: "Stroke width of the area border line.",
          },
          {
            property: "area.opacity",
            type: "number",
            default: "0.3",
            description: "Fill opacity of the area (0 to 1).",
          },
          {
            property: "area.spline",
            type: "boolean",
            default: "false",
            description: "Whether to use spline (smooth curve) interpolation.",
          },
        ],
      },
    ],
  },
  customParts: [
    { element: "line", args: "{ values: number[]; legend: string; index: number; isHovered: boolean }", description: "The area/line path element for a single series." },
    { element: "xAxis", args: "{ line: Widget; labels: Widget[]; tick: Widget }", description: "The complete x-axis assembly." },
    { element: "yAxis", args: "{ line: Widget; labels: Widget[]; tick: Widget }", description: "The complete y-axis assembly." },
    { element: "xAxisLabel", args: "{ name: string; index: number }", description: "Individual x-axis label." },
    { element: "yAxisLabel", args: "{ name: string; index: number }", description: "Individual y-axis label." },
    { element: "xAxisTick", args: "undefined", description: "X-axis tick mark." },
    { element: "yAxisTick", args: "undefined", description: "Y-axis tick mark." },
    { element: "xAxisLine", args: "undefined", description: "X-axis line." },
    { element: "yAxisLine", args: "undefined", description: "Y-axis line." },
    { element: "axisCorner", args: "undefined", description: "Corner element where x and y axes meet." },
    { element: "dataView", args: "{ lines: Widget[] }", description: "Container for all area/line widgets in the data area." },
    { element: "layout", args: "{ title: Widget; legends: Widget[]; plot: Widget }", description: "Top-level layout composing title, legends, and the plot area." },
    { element: "plot", args: "{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget; tooltipArea: Widget }", description: "The plot area composing axes, data view, grid, and tooltip." },
    { element: "legend", args: "{ name: string; index: number; isVisible: boolean }", description: "Individual legend item." },
    { element: "title", args: "undefined", description: "Chart title element." },
    { element: "dataLabel", args: "{ value: number; label: string; legend: string }", description: "Data label displayed at a data point." },
    { element: "grid", args: "{ xLine: Widget; yLine: Widget }", description: "Grid container for horizontal and vertical grid lines." },
    { element: "gridXLine", args: "undefined", description: "Individual vertical grid line." },
    { element: "gridYLine", args: "undefined", description: "Individual horizontal grid line." },
    { element: "tooltip", args: "{ label: string; items: { legend: string; color: string; value: number }[] }", description: "Tooltip content widget." },
    { element: "tooltipArea", args: "{ tooltip: Widget | null; hoveredPoint: HoveredLinePoint | null }", description: "Tooltip positioning area that manages tooltip display." },
  ],
  context: {
    typeName: "LineChartContext",
    properties: [
      { name: "data", type: "LineChartData", description: "Current chart data (filtered by hidden series).", kind: "property" },
      { name: "legends", type: "string[]", description: "All legend names from the raw data.", kind: "property" },
      { name: "width", type: "number", description: "Current chart width in pixels.", kind: "property" },
      { name: "height", type: "number", description: "Current chart height in pixels.", kind: "property" },
      { name: "plotWidth", type: "number", description: "Width of the plot area in pixels.", kind: "property" },
      { name: "plotHeight", type: "number", description: "Height of the plot area in pixels.", kind: "property" },
      { name: "scale", type: "LineChartScale | null", description: "Computed scale with min, max, and step.", kind: "property" },
      { name: "hiddenSeries", type: "ReadonlySet<string>", description: "Set of currently hidden series legend names.", kind: "property" },
      { name: "hoveredPoint", type: "{ index: number; legend: string } | null", description: "Currently hovered point info.", kind: "property" },
      { name: "config", type: "TConfig", description: "The resolved chart configuration object.", kind: "property" },
      { name: "isSeriesVisible(legend)", type: "(legend: string) => boolean", description: "Check if a series is currently visible.", kind: "method" },
      { name: "toggleSeries(legend)", type: "(legend: string) => void", description: "Toggle visibility of a series.", kind: "method" },
      { name: "hoverPoint(index, legend)", type: "(index: number, legend: string) => void", description: "Set hover state on a specific point.", kind: "method" },
      { name: "unhoverPoint(index, legend)", type: "(index: number, legend: string) => void", description: "Clear hover if the specified point is currently hovered.", kind: "method" },
      { name: "unhoverAllPoints()", type: "() => void", description: "Clear all point hover state.", kind: "method" },
      { name: "isPointHovered(index, legend)", type: "(index: number, legend: string) => boolean", description: "Check if a specific point is hovered.", kind: "method" },
      { name: "getPointValue(index, legend)", type: "(index: number, legend: string) => number | null", description: "Get the value of a data point.", kind: "method" },
      { name: "getPointPosition(index, legend)", type: "(index: number, legend: string) => { x: number; y: number } | null", description: "Get the pixel position of a data point.", kind: "method" },
    ],
  },
  overrideExample: `import { ToastAreaChart } from "@/components/flitter/charts/toast-area-chart";

<ToastAreaChart
  data={data}
  config={{
    area: { opacity: 0.5, spline: true },
  }}
/>`,
};
