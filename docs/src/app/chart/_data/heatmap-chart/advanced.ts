import type { AdvancedPageData } from "../types";

const advancedCode = `import HeatmapChart from "./charts/heatmap-chart";

HeatmapChart({
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
  scenarios: [
    {
      title: "Custom Color Scales",
      description: "Replace the default sequential color ramp with diverging, categorical, or threshold-based palettes. The segment renderer receives the raw value — apply Color.lerp between two endpoints for continuous scales, or use a switch/map for discrete category-to-color mappings.",
    },
    {
      title: "Cell Labels",
      description: "Render formatted numbers, status icons, or emoji indicators inside each cell. The segment renderer receives value, xIndex, and yIndex — return a Stack with the colored background and a centered Text widget showing the formatted value or a conditional icon.",
    },
    {
      title: "Click-to-Filter",
      description: "Click any cell to filter a linked table or companion chart. Wrap each segment in GestureDetector within the segment renderer — on click, call setState() to update a shared filter state that other widgets on the page also read.",
    },
    {
      title: "Row and Column Highlights",
      description: "Highlight an entire row or column on hover by tracking the hovered xIndex and yIndex in a StatefulWidget. The segment renderer reads the hovered indices from context and applies a brighter fill or border to all cells sharing that row or column.",
    },
    {
      title: "Calendar Heatmap",
      description: "Map dates to x/y positions for a GitHub-style contribution heatmap. Set x-axis labels to week numbers, y-axis labels to weekday abbreviations, and use the segment renderer to color each day cell by commit count or activity level.",
    },
    {
      title: "Rounded and Gapped Cells",
      description: "Replace square cells with rounded rectangles or circles for a softer look. The segment renderer returns a Container with BorderRadius and margin — add a 2px gap between cells by using Padding, creating a grid of pill-shaped or circular indicators.",
    },
  ],
};
