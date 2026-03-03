import type { AdvancedPageData } from "../types";

const advancedCode = `import { BarChart } from "@flitterjs/chart";

BarChart({
  style: "toast",
  data: { /* ... */ },
  custom: {
    bar: (args, context) => {
      // args: { value, label, legend, index }
      // context: BarChartController & { config }
      //   - context.data, context.scale, context.direction
      //   - context.width, context.height, context.legends
      //   - context.toggleSeries(), context.hoverBar(), ...
      // Return any Flitter Widget
    },
  },
  getScale: (data, options) => { /* core scale logic */ },
  getScaleOptions: (ctx) => ({
    roughStepCount: Math.floor(ctx.height / 40),
  }),
});`;

const customElements = [
  { element: "layout", args: "{ title: Widget, legends: Widget[], plot: Widget }", description: "Overall chart layout \u2014 arranges title, legend, and plot area" },
  { element: "plot", args: "{ xAxis: Widget, yAxis: Widget, series: Widget, grid: Widget, axisCorner: Widget }", description: "Plot area \u2014 positions axes, series, and grid together" },
  { element: "title", args: "{ name: string }", description: "Chart title text rendering" },
  { element: "legend", args: "{ name: string, index: number }", description: "Individual legend item rendering" },
  { element: "series", args: "{ barGroups: Widget[] }", description: "Series container \u2014 wraps all bar groups" },
  { element: "barGroup", args: "{ bars: { bar: Widget, value: number, datasetIndex: number }[], index: number, label: string }", description: "Bar group layout \u2014 arranges individual bars within a category (default: side-by-side Flex, stacked: stacked layout)" },
  { element: "barBox", args: "{ bar: Widget, value: number, ratio: number, alignment: Alignment, index: number }", description: "Individual bar sizing \u2014 wraps a bar with FractionallySizedBox (toast uses AnimatedFractionallySizedBox)" },
  { element: "bar", args: "{ value: number, label: string, legend: string, index: number }", description: "Individual bar element" },
  { element: "dataLabel", args: "{ value: number, label: string, legend: string }", description: "Data label displayed on or near a bar" },
  { element: "xAxis", args: "{ line: Widget, labels: Widget[], tick: Widget }", description: "X-axis container \u2014 assembles line, ticks, and labels" },
  { element: "yAxis", args: "{ line: Widget, labels: Widget[], tick: Widget }", description: "Y-axis container \u2014 assembles line, ticks, and labels" },
  { element: "xAxisLabel / yAxisLabel", args: "{ name: string, index: number }", description: "Individual axis label text" },
  { element: "xAxisTick / yAxisTick", args: "undefined", description: "Axis tick mark" },
  { element: "xAxisLine / yAxisLine", args: "undefined", description: "Axis baseline" },
  { element: "axisCorner", args: "undefined", description: "Corner where x-axis and y-axis meet" },
  { element: "grid", args: "{ xLine: Widget, yLine: Widget }", description: "Grid container \u2014 holds horizontal and vertical grid lines" },
  { element: "gridXLine / gridYLine", args: "undefined", description: "Individual grid line" },
];

export const advancedPage: AdvancedPageData = {
  slug: ["bar-chart", "advanced"],
  title: "Bar Chart \u2014 Advanced",
  description:
    "Custom renderers and headless architecture for bar charts.",
  pageType: "advanced",
  parent: "bar-chart",
  code: { basic: advancedCode },
  customElements,
};
