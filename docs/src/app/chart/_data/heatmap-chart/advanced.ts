import type { AdvancedPageData } from "../types";

const advancedCode = `import { HeatmapChart } from "@flitterjs/chart";

HeatmapChart({
  style: "toast",
  data: { /* ... */ },
  custom: {
    segment: (args, context) => {
      // args: { value, xIndex, yIndex }
      // context: HeatmapChartController & { config }
      //   - context.data, context.scale
      //   - context.width, context.height
      //   - context.toggleSeries(), ...
      // Return any Flitter Widget
    },
  },
});`;

const customElements = [
  { element: "layout", args: "{ title: Widget, legend: Widget, plot: Widget }", description: "Overall chart layout — arranges title, color-scale legend, and plot area" },
  { element: "plot", args: "{ xAxis: Widget, yAxis: Widget, dataView: Widget, axisCorner: Widget }", description: "Plot area — positions axes and data view together (no grid)" },
  { element: "title", args: "undefined", description: "Chart title text rendering" },
  { element: "legend", args: "undefined", description: "Color-scale legend bar" },
  { element: "dataView", args: "{ segments: Widget[][] }", description: "Data view container — wraps all segment widgets as a 2D grid [yIndex][xIndex]" },
  { element: "segment", args: "{ value: number, xIndex: number, yIndex: number }", description: "Individual heatmap cell element" },
  { element: "xAxis", args: "{ line: Widget, labels: Widget[], tick: Widget }", description: "X-axis container — assembles line, ticks, and labels" },
  { element: "yAxis", args: "{ line: Widget, labels: Widget[], tick: Widget }", description: "Y-axis container — assembles line, ticks, and labels" },
  { element: "xAxisLabel / yAxisLabel", args: "{ name: string, index: number }", description: "Individual axis label text" },
  { element: "xAxisTick / yAxisTick", args: "undefined", description: "Axis tick mark" },
  { element: "xAxisLine / yAxisLine", args: "undefined", description: "Axis baseline" },
  { element: "axisCorner", args: "undefined", description: "Corner where x-axis and y-axis meet" },
];

export const advancedPage: AdvancedPageData = {
  slug: ["heatmap-chart", "advanced"],
  title: "Heatmap Chart — Advanced",
  description: "Custom renderers and headless architecture for heatmap charts.",
  pageType: "advanced",
  parent: "heatmap-chart",
  code: { basic: advancedCode },
  customElements,
};
