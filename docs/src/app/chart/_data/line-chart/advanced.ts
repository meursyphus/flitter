import type { AdvancedPageData } from "../types";

const advancedCode = `import LineChart from "./charts/line-chart";

LineChart({
  data: { /* ... */ },
  custom: {
    line: (args, context) => {
      // args: { values, legend, index }
      // context: LineChartController & { config }
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
  { element: "dataView", args: "{ lines: Widget[] }", description: "Data view container — wraps all line widgets" },
  { element: "line", args: "{ values: number[], legend: string, index: number }", description: "Individual line element for a dataset" },
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
  slug: ["line-chart", "advanced"],
  title: "Line Chart — Advanced",
  description: "Custom renderers and headless architecture for line charts.",
  pageType: "advanced",
  parent: "line-chart",
  code: { basic: advancedCode },
  customElements,
  scenarios: [
    {
      title: "Gradient Fills",
      description: "Replace the line renderer with a gradient-filled path using CustomPaint. Fade from the series color at the curve down to transparent at the baseline — each dataset gets its own gradient stops and opacity.",
    },
    {
      title: "Interactive Crosshair",
      description: "Add a vertical crosshair line that follows the cursor and snaps to the nearest data point. Combine GestureDetector on the plot area with a Positioned tooltip card showing interpolated values for all series.",
    },
    {
      title: "Segmented Lines",
      description: "Render different line styles per segment based on data characteristics. Use dashed strokes for projections, solid for actuals, and dotted for estimates — the line renderer receives the full value array to decide per-segment styling.",
    },
    {
      title: "Threshold Bands",
      description: "Overlay colored horizontal bands behind the line to highlight warning, danger, or target zones. The plot renderer is a Stack — layer Positioned rectangles at scale-mapped y-coordinates before the data view.",
    },
    {
      title: "Custom Data Points",
      description: "Replace default circle dots with icons, images, or animated pulsing markers at each data point. The dataLabel renderer receives the exact x/y position and value — return any widget including animated ones.",
    },
    {
      title: "Multi-Axis",
      description: "Add a second y-axis with an independent scale on the right side. Override the plot renderer to include a second yAxis widget. Each line renderer knows which axis it maps to via the context object.",
    },
  ],
};
