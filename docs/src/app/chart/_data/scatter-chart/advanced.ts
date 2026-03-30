import type { AdvancedPageData } from "../types";

const advancedCode = `import ScatterChart from "./charts/scatter-chart";

ScatterChart({
  data: { /* ... */ },
  custom: {
    scatter: (args, context) => {
      // args: { label, legend, index }
      // context: ScatterChartController & { config }
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
  { element: "dataView", args: "{ scatters: { widget: Widget, x: number, y: number }[], scale: ScatterChartScale }", description: "Data view container — wraps all scatter point widgets with position data" },
  { element: "scatter", args: "{ label: string, legend: string, index: number }", description: "Individual scatter point element" },
  { element: "dataLabel", args: "{ x: number, y: number, value: number, label: string, legend: string }", description: "Data label displayed near a scatter point" },
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
  slug: ["scatter-chart", "advanced"],
  title: "Scatter Chart — Advanced",
  description: "Custom renderers and headless architecture for scatter charts.",
  pageType: "advanced",
  parent: "scatter-chart",
  code: { basic: advancedCode },
  customElements,
  scenarios: [
    {
      title: "Cluster Highlighting",
      description: "Color or encircle point clusters based on K-means or custom grouping logic. The scatter renderer receives the full data context including x, y, and label — apply different Container colors or wrap clusters in a CustomPaint ellipse overlay.",
    },
    {
      title: "Custom Point Shapes",
      description: "Replace default circle dots with icons, images, or category-specific markers. Each scatter point is an independent widget — return a ClipOval with an Image, a rotated Transform with a diamond shape, or a Container with a custom BoxDecoration.",
    },
    {
      title: "Regression Lines",
      description: "Overlay trend lines, confidence intervals, or polynomial curve fits on the scatter plot. Override the dataView renderer to add a CustomPaint child that draws the regression path using the scale context to map data coordinates to pixel positions.",
    },
    {
      title: "Lasso Selection",
      description: "Draw a freeform selection region to highlight and filter points interactively. Use GestureDetector with onPanStart/onPanUpdate in a custom dataView renderer to track the lasso path, then filter visible scatter widgets by hit-testing against the polygon.",
    },
    {
      title: "Quadrant Labels",
      description: "Divide the plot into four labeled quadrants with colored backgrounds for portfolio analysis or risk matrices. Override the plot renderer to layer Positioned rectangles at the median x/y values with semi-transparent fills and corner-anchored Text labels.",
    },
    {
      title: "Zoom and Pan",
      description: "Add axis-level zoom with scroll gestures and drag-to-pan. Wrap the plot in a GestureDetector that updates scale min/max values via setState(). Points and axes reposition automatically as the constraint-based layout recalculates.",
    },
  ],
};
