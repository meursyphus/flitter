import type { AdvancedPageData } from "../types";

const advancedCode = `import BubbleChart from "./charts/bubble-chart";

BubbleChart({
  data: { /* ... */ },
  custom: {
    bubble: (args, context) => {
      // args: { value, label, legend, index }
      // context: BubbleChartController & { config }
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
  { element: "dataView", args: "{ bubbles: { widget: Widget, x: number, y: number }[], scale: BubbleChartScale }", description: "Data view container — wraps all bubble widgets with position data" },
  { element: "bubble", args: "{ value: number, label: string, legend: string, index: number }", description: "Individual bubble element — value determines bubble size" },
  { element: "dataLabel", args: "{ x: number, y: number, value: number, label: string, legend: string }", description: "Data label displayed near a bubble" },
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
  slug: ["bubble-chart", "advanced"],
  title: "Bubble Chart — Advanced",
  description: "Custom renderers and headless architecture for bubble charts.",
  pageType: "advanced",
  parent: "bubble-chart",
  code: { basic: advancedCode },
  customElements,
  scenarios: [
    {
      title: "Size Legend",
      description: "Add a bubble-size legend showing what small, medium, and large radii represent. Override the layout renderer to place a custom Row of reference circles with value labels next to the main legend — the context provides the min/max bubble values for accurate sizing.",
    },
    {
      title: "Category Colors",
      description: "Map bubble color to a categorical dimension like region, department, or risk level. The bubble renderer receives label, legend, and index — use a lookup map to return Container widgets with category-specific BoxDecoration colors and optional border rings.",
    },
    {
      title: "Labels Inside Bubbles",
      description: "Render text or icons inside large bubbles and external labels with leader lines for small ones. The bubble renderer receives the value which determines rendered size — conditionally return a Stack with centered Text for large bubbles, or a Column with a CustomPaint connector for small ones.",
    },
    {
      title: "Collision Avoidance",
      description: "Shift overlapping data labels apart automatically using a force-directed layout. Override the dataView renderer to compute label positions with a simple repulsion algorithm, then place each dataLabel widget at its adjusted coordinate via Positioned.",
    },
    {
      title: "Staggered Animated Entry",
      description: "Bubbles pop in one by one with staggered scale animations on initial load. Each bubble renderer wraps its output in AnimatedScale with a delay based on the index — use Interval curves so bubbles appear sequentially from left to right.",
    },
    {
      title: "Click-to-Detail Panel",
      description: "Click any bubble to expand a detail panel showing full entity data, trends, or actions. Wrap each bubble in GestureDetector within the bubble renderer — on click, update a StatefulWidget to show an overlay Card positioned near the clicked bubble.",
    },
  ],
};
