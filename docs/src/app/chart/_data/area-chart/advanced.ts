import type { AdvancedPageData } from "../types";

const advancedCode = `import AreaChart from "./charts/area-chart";

AreaChart({
  data: { /* ... */ },
  custom: {
    line: (args, context) => {
      // args: { values, legend, index }
      // context: AreaChartController & { config }
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
  { element: "layout", args: "{ title: Widget, legends: Widget[], plot: Widget }", description: "Overall chart layout \u2014 arranges title, legend, and plot area" },
  { element: "plot", args: "{ xAxis: Widget, yAxis: Widget, dataView: Widget, grid: Widget, axisCorner: Widget }", description: "Plot area \u2014 positions axes, data view, and grid together" },
  { element: "title", args: "undefined", description: "Chart title text rendering" },
  { element: "legend", args: "{ name: string, index: number }", description: "Individual legend item rendering" },
  { element: "dataView", args: "{ lines: Widget[] }", description: "Data view container \u2014 wraps all area/line widgets" },
  { element: "line", args: "{ values: number[], legend: string, index: number }", description: "Individual area/line element for a dataset" },
  { element: "dataLabel", args: "{ value: number, label: string, legend: string }", description: "Data label displayed on or near a data point" },
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
  slug: ["area-chart", "advanced"],
  title: "Area Chart \u2014 Advanced",
  description: "Custom renderers and headless architecture for area charts.",
  pageType: "advanced",
  parent: "area-chart",
  code: { basic: advancedCode },
  customElements,
  scenarios: [
    {
      title: "Layered Gradients",
      description: "Stack translucent gradient fills per series using CustomPaint with LinearGradient. Each area renderer controls its own color stops, direction, and opacity — layer semi-transparent fills to show overlap between datasets.",
    },
    {
      title: "Range Highlights",
      description: "Shade specific x-axis ranges to call out events, seasons, or anomalies. Use the plot renderer to layer Positioned rectangles at scale-mapped x-coordinates — highlight Q4 holiday season or mark outage windows in red.",
    },
    {
      title: "Sparkline Mode",
      description: "Strip axes, legends, and grid to render a minimal area fill for inline dashboard cards or table cells. Override the layout renderer to return only the dataView — produces a compact, embeddable micro-chart.",
    },
    {
      title: "Animated Reveal",
      description: "Clip the area from left to right on load using ClipRect with an AnimationController. The line renderer wraps its output in a clipping widget whose width fraction animates from 0 to 1 with a custom Curve.",
    },
    {
      title: "Peak and Trough Labels",
      description: "Automatically place labels at local maxima and minima in the dataset. The dataLabel renderer receives the value and position — use conditional logic to only render labels where the derivative changes sign.",
    },
    {
      title: "Period Comparison Overlay",
      description: "Overlay a previous period as a dashed outline on top of the current filled area. The dataView renderer receives all line widgets — add a second semi-transparent line widget with a dashed stroke for year-over-year comparison.",
    },
  ],
};
