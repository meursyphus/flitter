import type { ApiPageData } from "../types";

export const stackedBarChartApiPage: ApiPageData = {
  slug: ["api", "stacked-bar-chart"],
  title: "Stacked Bar Chart API",
  description:
    "Complete API reference for the Stacked Bar Chart. Uses the bar-chart headless engine with stacked bar-specific configuration.",
  pageType: "api",
  parent: "api",
  dataFormat: {
    typeName: "BarChartData",
    typeDefinition: `type BarChartData = {
  labels: string[];
  datasets: { legend: string; values: number[] }[];
};`,
    description:
      "Stacked Bar Chart reuses the BarChartData format. Each dataset represents a stacked series with values accumulated on top of previous series.",
  },
  agConfig: {
    sections: [
      {
        title: "Bar",
        rows: [
          {
            property: "bar.gap",
            type: "number",
            default: "0",
            description: "Gap between stacked bars (typically 0 for stacked layout).",
          },
        ],
      },
    ],
  },
  toastConfig: {
    sections: [
      {
        title: "Bar",
        rows: [
          {
            property: "bar.gap",
            type: "number",
            default: "0",
            description: "Gap between stacked bars (typically 0 for stacked layout).",
          },
        ],
      },
    ],
  },
  customParts: [
    { element: "barGroup", args: "{ bars: { bar: Widget; value: number; datasetIndex: number }[]; index: number; label: string }", description: "Container for a group of stacked bars at a single label position." },
    { element: "barBox", args: "{ bar: Widget; value: number; ratio: number; alignment: Alignment; index: number; label: string; legend: string; isHovered: boolean }", description: "Wrapper around each individual stacked bar segment." },
    { element: "bar", args: "{ value: number; label: string; legend: string; index: number; isHovered: boolean }", description: "The visual bar element itself." },
    { element: "xAxis", args: "{ line: Widget; labels: Widget[]; tick: Widget }", description: "The complete x-axis assembly." },
    { element: "yAxis", args: "{ line: Widget; labels: Widget[]; tick: Widget }", description: "The complete y-axis assembly." },
    { element: "xAxisLabel", args: "{ name: string; index: number }", description: "Individual x-axis label." },
    { element: "yAxisLabel", args: "{ name: string; index: number }", description: "Individual y-axis label." },
    { element: "xAxisTick", args: "undefined", description: "X-axis tick mark." },
    { element: "yAxisTick", args: "undefined", description: "Y-axis tick mark." },
    { element: "xAxisLine", args: "undefined", description: "X-axis line." },
    { element: "yAxisLine", args: "undefined", description: "Y-axis line." },
    { element: "axisCorner", args: "undefined", description: "Corner element where x and y axes meet." },
    { element: "dataView", args: "{ barGroups: Widget[] }", description: "Container for all bar groups in the data area." },
    { element: "layout", args: "{ title: Widget; legends: Widget[]; plot: Widget }", description: "Top-level layout composing title, legends, and the plot area." },
    { element: "plot", args: "{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget; tooltipArea: Widget }", description: "The plot area composing axes, data view, grid, and tooltip." },
    { element: "legend", args: "{ name: string; index: number; isVisible: boolean }", description: "Individual legend item." },
    { element: "title", args: "undefined", description: "Chart title element." },
    { element: "dataLabel", args: "{ value: number; label: string; legend: string }", description: "Data label displayed on or near a bar." },
    { element: "grid", args: "{ xLine: Widget; yLine: Widget }", description: "Grid container for horizontal and vertical grid lines." },
    { element: "gridXLine", args: "undefined", description: "Individual vertical grid line." },
    { element: "gridYLine", args: "undefined", description: "Individual horizontal grid line." },
    { element: "tooltip", args: "{ label: string; items: { legend: string; color: string; value: number }[] }", description: "Tooltip content widget." },
    { element: "tooltipArea", args: "{ tooltip: Widget | null; hoveredBar: { index: number; legend: string; value: number; label: string; x: number; y: number; width: number; height: number } | null }", description: "Tooltip positioning area that manages tooltip display." },
  ],
  context: {
    typeName: "BarChartContext",
    properties: [
      { name: "data", type: "BarChartData", description: "Current chart data (filtered by hidden series).", kind: "property" },
      { name: "legends", type: "string[]", description: "All legend names from the raw data.", kind: "property" },
      { name: "direction", type: '"vertical" | "horizontal"', description: "Current bar direction.", kind: "property" },
      { name: "width", type: "number", description: "Current chart width in pixels.", kind: "property" },
      { name: "height", type: "number", description: "Current chart height in pixels.", kind: "property" },
      { name: "scale", type: "BarChartScale | null", description: "Computed scale with min, max, and step.", kind: "property" },
      { name: "hiddenSeries", type: "ReadonlySet<string>", description: "Set of currently hidden series legend names.", kind: "property" },
      { name: "hoveredBar", type: "{ index: number; legend: string } | null", description: "Currently hovered bar info.", kind: "property" },
      { name: "config", type: "TConfig", description: "The resolved chart configuration object.", kind: "property" },
      { name: "isSeriesVisible(legend)", type: "(legend: string) => boolean", description: "Check if a series is currently visible.", kind: "method" },
      { name: "toggleSeries(legend)", type: "(legend: string) => void", description: "Toggle visibility of a series.", kind: "method" },
      { name: "showSeries(legend)", type: "(legend: string) => void", description: "Show a hidden series.", kind: "method" },
      { name: "hideSeries(legend)", type: "(legend: string) => void", description: "Hide a visible series.", kind: "method" },
      { name: "showAllSeries()", type: "() => void", description: "Show all hidden series.", kind: "method" },
      { name: "hoverBar(index, legend, anchorKey)", type: "(index: number, legend: string, anchorKey: GlobalKey) => void", description: "Set hover state on a specific bar.", kind: "method" },
      { name: "unhoverBar(index, legend)", type: "(index: number, legend: string) => void", description: "Clear hover if the specified bar is currently hovered.", kind: "method" },
      { name: "unhoverAllBars()", type: "() => void", description: "Clear all bar hover state.", kind: "method" },
      { name: "isBarHovered(index, legend)", type: "(index: number, legend: string) => boolean", description: "Check if a specific bar is hovered.", kind: "method" },
      { name: "setSize(width, height)", type: "(width: number, height: number) => void", description: "Update chart dimensions.", kind: "method" },
    ],
  },
  overrideExample: `import { ToastStackedBarChart } from "@/components/flitter/charts/toast-stacked-bar-chart";

<ToastStackedBarChart
  data={data}
  config={{
    bar: { gap: 2 },
  }}
/>`,
};
