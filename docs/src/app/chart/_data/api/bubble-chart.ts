import type { ApiPageData } from "../types";

export const bubbleChartApiPage: ApiPageData = {
  slug: ["api", "bubble-chart"],
  title: "Bubble Chart API",
  description:
    "Complete API reference for the Bubble Chart, including data format, configuration options, custom parts, and context methods.",
  pageType: "api",
  parent: "api",
  dataFormat: {
    typeName: "BubbleChartData",
    typeDefinition: `type BubbleChartData = {
  datasets: {
    legend: string;
    data: { x: number; y: number; value: number; label: string }[];
  }[];
};`,
    description:
      "Each dataset contains a series of data points with x/y coordinates, a bubble size value, and a label.",
  },
  agConfig: {
    sections: [
      {
        title: "Bubble",
        rows: [
          {
            property: "bubble.minRadius",
            type: "number",
            default: "3",
            description: "Minimum bubble radius in pixels.",
          },
          {
            property: "bubble.maxRadius",
            type: "number",
            default: "25",
            description: "Maximum bubble radius in pixels.",
          },
          {
            property: "bubble.opacity",
            type: "number",
            default: "0.7",
            description: "Fill opacity of bubbles (0 to 1).",
          },
        ],
      },
    ],
  },
  toastConfig: {
    sections: [
      {
        title: "Bubble",
        rows: [
          {
            property: "bubble.minRadius",
            type: "number",
            default: "5",
            description: "Minimum bubble radius in pixels.",
          },
          {
            property: "bubble.maxRadius",
            type: "number",
            default: "50",
            description: "Maximum bubble radius in pixels.",
          },
          {
            property: "bubble.opacity",
            type: "number",
            default: "0.6",
            description: "Fill opacity of bubbles (0 to 1).",
          },
        ],
      },
    ],
  },
  customParts: [
    { element: "bubble", args: "{ value: number; label: string; legend: string; index: number; isHovered: boolean }", description: "Individual bubble element." },
    { element: "xAxis", args: "{ line: Widget; labels: Widget[]; tick: Widget }", description: "The complete x-axis assembly." },
    { element: "yAxis", args: "{ line: Widget; labels: Widget[]; tick: Widget }", description: "The complete y-axis assembly." },
    { element: "xAxisLabel", args: "{ name: string; index: number }", description: "Individual x-axis label." },
    { element: "yAxisLabel", args: "{ name: string; index: number }", description: "Individual y-axis label." },
    { element: "xAxisTick", args: "undefined", description: "X-axis tick mark." },
    { element: "yAxisTick", args: "undefined", description: "Y-axis tick mark." },
    { element: "xAxisLine", args: "undefined", description: "X-axis line." },
    { element: "yAxisLine", args: "undefined", description: "Y-axis line." },
    { element: "axisCorner", args: "undefined", description: "Corner element where x and y axes meet." },
    { element: "dataView", args: "{ bubbles: { widget: Widget; x: number; y: number }[]; scale: BubbleChartScale }", description: "Container for all bubble widgets." },
    { element: "layout", args: "{ title: Widget; legends: Widget[]; plot: Widget }", description: "Top-level layout composing title, legends, and the plot area." },
    { element: "plot", args: "{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget }", description: "The plot area composing axes, data view, and grid." },
    { element: "legend", args: "{ name: string; index: number; isVisible: boolean }", description: "Individual legend item." },
    { element: "title", args: "undefined", description: "Chart title element." },
    { element: "dataLabel", args: "{ x: number; y: number; value: number; label: string; legend: string }", description: "Data label at a bubble point." },
    { element: "grid", args: "{ xLine: Widget; yLine: Widget }", description: "Grid container." },
    { element: "gridXLine", args: "undefined", description: "Individual vertical grid line." },
    { element: "gridYLine", args: "undefined", description: "Individual horizontal grid line." },
    { element: "tooltip", args: "{ label: string; items: { legend: string; color: string; value: number }[] }", description: "Tooltip content widget." },
  ],
  context: {
    typeName: "BubbleChartContext",
    properties: [
      { name: "data", type: "BubbleChartData", description: "Current chart data (filtered by hidden series).", kind: "property" },
      { name: "legends", type: "string[]", description: "All legend names from the raw data.", kind: "property" },
      { name: "width", type: "number", description: "Current chart width in pixels.", kind: "property" },
      { name: "height", type: "number", description: "Current chart height in pixels.", kind: "property" },
      { name: "scale", type: "BubbleChartScale | null", description: "Computed scale with x, y, and value ranges.", kind: "property" },
      { name: "hiddenSeries", type: "ReadonlySet<string>", description: "Set of currently hidden series.", kind: "property" },
      { name: "hoveredBubble", type: "{ index: number; legend: string } | null", description: "Currently hovered bubble info.", kind: "property" },
      { name: "config", type: "TConfig", description: "The resolved chart configuration object.", kind: "property" },
      { name: "isSeriesVisible(legend)", type: "(legend: string) => boolean", description: "Check if a series is currently visible.", kind: "method" },
      { name: "toggleSeries(legend)", type: "(legend: string) => void", description: "Toggle visibility of a series.", kind: "method" },
      { name: "showSeries(legend)", type: "(legend: string) => void", description: "Show a hidden series.", kind: "method" },
      { name: "hideSeries(legend)", type: "(legend: string) => void", description: "Hide a visible series.", kind: "method" },
      { name: "showAllSeries()", type: "() => void", description: "Show all hidden series.", kind: "method" },
      { name: "hoverBubble(index, legend)", type: "(index: number, legend: string) => void", description: "Set hover state on a bubble.", kind: "method" },
      { name: "unhoverBubble(index, legend)", type: "(index: number, legend: string) => void", description: "Clear hover if the specified bubble is currently hovered.", kind: "method" },
      { name: "unhoverAllBubbles()", type: "() => void", description: "Clear all bubble hover state.", kind: "method" },
      { name: "isBubbleHovered(index, legend)", type: "(index: number, legend: string) => boolean", description: "Check if a specific bubble is hovered.", kind: "method" },
      { name: "setSize(width, height)", type: "(width: number, height: number) => void", description: "Update chart dimensions.", kind: "method" },
    ],
  },
  overrideExample: `import { ToastBubbleChart } from "@/components/flitter/charts/toast-bubble-chart";

<ToastBubbleChart
  data={data}
  config={{
    bubble: { minRadius: 8, maxRadius: 40, opacity: 0.5 },
  }}
/>`,
};
