import type { AdvancedPageData } from "../types";

const advancedCode = `import StackedBarChart from "./charts/stacked-bar-chart";

StackedBarChart({
  data: { /* ... */ },
  custom: {
    bar: (args, context) => {
      // args: { value, label, legend, index }
      // context: StackedBarChartController & { config }
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
  { element: "layout", args: "{ title: Widget, legends: Widget[], plot: Widget }", description: "Overall chart layout — arranges title, legend, and plot area" },
  { element: "plot", args: "{ xAxis: Widget, yAxis: Widget, series: Widget, grid: Widget, axisCorner: Widget }", description: "Plot area — positions axes, series, and grid together" },
  { element: "title", args: "{ name: string }", description: "Chart title text rendering" },
  { element: "legend", args: "{ name: string, index: number }", description: "Individual legend item rendering" },
  { element: "series", args: "{ barGroups: Widget[] }", description: "Series container — wraps all bar groups" },
  { element: "barGroup", args: "{ bars: { bar: Widget, value: number, datasetIndex: number }[], index: number, label: string }", description: "Bar group layout — arranges stacked bars within a category" },
  { element: "barBox", args: "{ bar: Widget, value: number, ratio: number, alignment: Alignment, index: number }", description: "Individual bar sizing — wraps a bar with FractionallySizedBox" },
  { element: "bar", args: "{ value: number, label: string, legend: string, index: number }", description: "Individual bar element" },
  { element: "dataLabel", args: "{ value: number, label: string, legend: string }", description: "Data label displayed on or near a bar" },
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
  slug: ["stacked-bar-chart", "advanced"],
  title: "Stacked Bar Chart — Advanced",
  description: "Custom renderers and headless architecture for stacked bar charts.",
  pageType: "advanced",
  parent: "stacked-bar-chart",
  code: { basic: advancedCode },
  customElements,
  scenarios: [
    {
      title: "Percentage Mode",
      description: "Normalize all stacks to 100% height to show proportional contributions instead of absolute values. Override the barGroup renderer to divide each segment's height by the group total — the args provide all bar values and datasetIndex for the calculation.",
    },
    {
      title: "Segment Labels",
      description: "Show formatted values or percentages inside each stack segment. The dataLabel renderer receives value, label, and legend — return a centered Text widget with white color for dark segments and dark color for light segments based on the bar's background.",
    },
    {
      title: "Diverging Stacks",
      description: "Center the stack at zero with positive segments extending right and negative segments extending left. Override the barGroup renderer to split bars by sign, arrange them in opposite directions using a Row with mainAxisAlignment center, and apply distinct color palettes per direction.",
    },
    {
      title: "Highlight on Hover",
      description: "Dim all segments except the hovered series across every group for cross-group comparison. Track the hovered legend index in a StatefulWidget, then in the bar renderer check if the current datasetIndex matches — apply Opacity(0.2) to non-matching bars.",
    },
    {
      title: "Custom Interactive Legends",
      description: "Replace default legend items with colored toggle switches, inline sparklines, or percentage badges. The legend renderer is a full widget factory — return a Row with a custom CheckBox, series sparkline, and formatted total, all wrapped in GestureDetector for toggle behavior.",
    },
    {
      title: "Waterfall Variant",
      description: "Offset stacked segments vertically to create a waterfall chart showing running totals. Override the barBox renderer to set each segment's vertical offset based on the cumulative sum of previous segments — the args provide ratio and alignment for precise positioning.",
    },
  ],
};
