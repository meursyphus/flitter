import type { AdvancedPageData } from "../types";

const advancedCode = `import StackedAreaChart from "./charts/stacked-area-chart";

StackedAreaChart({
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
  scenarios: [
    {
      title: "Percentage Stacking",
      description: "Normalize all series to 100% height to show proportional contributions over time. The line renderer adjusts fill boundaries by dividing each value by the column total — useful for showing market share, traffic source mix, or budget allocation trends.",
    },
    {
      title: "Stream Graph",
      description: "Center the stacked areas symmetrically around a baseline for an organic, flowing stream layout. Override the dataView renderer to offset each layer's y-coordinates by half the total stack height, creating the distinctive ThemeRiver silhouette.",
    },
    {
      title: "Series Isolation on Click",
      description: "Click a legend item to isolate one series and fade all others to 10% opacity. Track the active series index in a StatefulWidget — the line renderer checks if its index matches the active one and applies full or reduced opacity accordingly.",
    },
    {
      title: "Gradient Layers",
      description: "Apply distinct vertical gradient fills per stacked layer using CustomPaint with LinearGradient. Each line renderer controls its own color stops — fade from a solid color at the top boundary to a lighter tint at the bottom for visual depth.",
    },
    {
      title: "Event Annotation Markers",
      description: "Place vertical event markers at specific x-positions that span across all stacked layers. Override the plot renderer to add Positioned vertical lines with callout labels — mark product launches, incidents, or seasonal events on the timeline.",
    },
    {
      title: "Smoothed Spline Curves",
      description: "Switch from linear interpolation to Catmull-Rom or cubic Bezier spline curves for a smoother appearance. The line renderer controls the SVG path algorithm — replace straight line segments with computed control points for organic, flowing area boundaries.",
    },
  ],
};
