import type { AdvancedPageData } from "../types";

const advancedCode = `import { StackedAreaChart } from "@flitterjs/chart";

StackedAreaChart({
  style: "toast",
  data: { /* ... */ },
  custom: {
    line: (args, context) => {
      // args: { values, legend, index }
      // context: StackedAreaChartController & { config }
      //   - context.data, context.scale
      //   - context.width, context.height, context.legends
      //   - context.toggleSeries(), ...
      // Return any Flitter Widget
    },
  },
  getScale: (data, options) => { /* core scale logic */ },
  getScaleOptions: (ctx) => ({
    roughStepCount: Math.floor(ctx.height / 40),
  }),
});`;

const customElements = [
  { element: "layout", args: "{ title: Widget, legends: Widget[], plot: Widget }", description: "Overall chart layout — arranges title, legend, and plot area" },
  { element: "plot", args: "{ xAxis: Widget, yAxis: Widget, dataView: Widget, grid: Widget, axisCorner: Widget }", description: "Plot area — positions axes, data view, and grid together" },
  { element: "title", args: "undefined", description: "Chart title text rendering" },
  { element: "legend", args: "{ name: string, index: number }", description: "Individual legend item rendering" },
  { element: "dataView", args: "{ lines: Widget[] }", description: "Data view container — wraps all stacked area/line widgets" },
  { element: "line", args: "{ values: number[], legend: string, index: number }", description: "Individual stacked area/line element for a dataset" },
  { element: "dataLabel", args: "{ value: number, label: string, legend: string }", description: "Data label displayed on or near a data point" },
  { element: "xAxis", args: "{ line: Widget, labels: Widget[], tick: Widget }", description: "X-axis container — assembles line, ticks, and labels" },
  { element: "yAxis", args: "{ line: Widget, labels: Widget[], tick: Widget }", description: "Y-axis container — assembles line, ticks, and labels" },
  { element: "xAxisLabel / yAxisLabel", args: "{ name: string, index: number }", description: "Individual axis label text" },
  { element: "xAxisTick / yAxisTick", args: "undefined", description: "Axis tick mark" },
  { element: "xAxisLine / yAxisLine", args: "undefined", description: "Axis baseline" },
  { element: "axisCorner", args: "undefined", description: "Corner where x-axis and y-axis meet" },
  { element: "grid", args: "{ xLine: Widget, yLine: Widget }", description: "Grid container — holds horizontal and vertical grid lines" },
  { element: "gridXLine / gridYLine", args: "undefined", description: "Individual grid line" },
];

export const advancedPage: AdvancedPageData = {
  slug: ["stacked-area-chart", "advanced"],
  title: "Stacked Area Chart — Advanced",
  description: "Custom renderers and headless architecture for stacked area charts.",
  pageType: "advanced",
  parent: "stacked-area-chart",
  code: { basic: advancedCode },
  customElements,
};
