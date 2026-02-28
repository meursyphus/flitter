export type ChartPageType = "overview" | "style" | "advanced";

export type ChartPageData = {
  slug: string[];
  title: string;
  description: string;
  pageType: ChartPageType;
  status?: "available" | "coming";
  /** Parent chart slug for sub-pages (styles, advanced) */
  parent?: string;
  /** Style-specific metadata */
  styleMeta?: {
    tagline: string;
    features: string[];
    inspiration?: string;
  };
  /** Code snippets for display */
  code?: {
    basic?: string;
    config?: string;
    fullConfigType?: string;
    examples?: { title: string; code: string }[];
  };
  /** Configuration table rows */
  configSections?: ConfigSection[];
  /** Customizable elements for advanced page */
  customElements?: { element: string; args: string; description: string }[];
};

export type ConfigSection = {
  title: string;
  description?: string;
  rows: ConfigRow[];
};

export type ConfigRow = {
  property: string;
  type: string;
  default: string;
  description?: string;
};

// ---------------------------------------------------------------------------
// Bar Chart data
// ---------------------------------------------------------------------------

const barChartBasicCode = `import { BarChart } from "@flitterjs/chart";
import { Widget } from "@flitterjs/react";

// Create chart widget
const chart = BarChart({
  style: "toast",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      { legend: "Revenue", values: [40, 65, 50, 80] },
    ],
  },
});

// Render with React
<Widget widget={chart} width={600} height={400} />`;

const barChartToastConfigCode = `BarChart({
  style: "toast",
  data: { /* ... */ },
  config: {
    colors: ["#6366f1", "#10b981"],
    bar: { cornerRadius: 4 },
    animation: { duration: 500 },
  },
});`;

const toastFullConfigType = `type ToastBarChartConfig = {
  /** Color palette for dataset series — cycles automatically when datasets exceed palette length */
  colors: string[];
  /** Base typography applied to axis labels and legend text */
  font: {
    family: string;  // default: "Noto Sans JP"
    size: number;    // default: 11
  };
  /** Chart title configuration */
  title: {
    visible: boolean;                          // default: true
    color: string;                             // default: "#000000"
    fontSize: number;                          // default: 16
    fontFamily?: string;                       // overrides font.family
    fontWeight?: string;                       // default: "bold"
    position: "top" | "bottom";                // default: "top"
    alignment: "start" | "center" | "end";     // default: "center"
  };
  /** Legend display options */
  legend: {
    visible: boolean;                // default: true
    position: "top" | "bottom";      // default: "bottom"
  };
  /** Axis styling — applies to both x-axis and y-axis */
  axis: {
    color: string;       // line and tick color, default: "#BBBBBB"
    thickness: number;   // line thickness in px, default: 1
    label: {
      color: string;     // default: "#666666"
      fontSize: number;  // default: 11
      gap: number;       // gap between tick and label in px, default: 8
    };
    tick: {
      size: number;      // tick mark length in px, default: 6
    };
  };
  /** Grid lines behind the chart area */
  grid: {
    color: string;       // default: "#EEEEEE"
    thickness: number;   // default: 1
  };
  /** Chart area padding in pixels */
  padding: {
    top: number;     // default: 30
    right: number;   // default: 20
    bottom: number;  // default: 40
    left: number;    // default: 60
  };
  /** Bar appearance */
  bar: {
    gap: number;          // margin between bars in a group (px), default: 1
    cornerRadius: number; // bar corner radius (px), default: 0
  };
  /** Entry animation settings */
  animation: {
    enabled: boolean;      // default: true
    duration: number;      // duration per bar group in ms, default: 300
    staggerDelay: number;  // delay between groups in ms, default: 60
  };
};`;

const toastExamples: { title: string; code: string }[] = [
  {
    title: "Multi-Dataset",
    code: `BarChart({
  style: "toast",
  title: "Quarterly Comparison",
  data: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      { legend: "2024", values: [150, 200, 180, 220] },
      { legend: "2025", values: [170, 210, 240, 260] },
    ],
  },
  config: {
    colors: ["#6366f1", "#10b981"],
  },
});`,
  },
  {
    title: "Horizontal Direction",
    code: `BarChart({
  style: "toast",
  direction: "horizontal",
  data: {
    labels: ["Marketing", "Engineering", "Design", "Sales"],
    datasets: [
      { legend: "Headcount", values: [12, 28, 8, 15] },
    ],
  },
  config: {
    colors: ["#f59e0b"],
  },
});`,
  },
  {
    title: "Rounded Bars",
    code: `BarChart({
  style: "toast",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      { legend: "Steps", values: [8000, 12000, 6500, 9200, 11000] },
    ],
  },
  config: {
    colors: ["#8b5cf6"],
    bar: { cornerRadius: 4, gap: 2 },
  },
});`,
  },
];

const toastConfigSections: ConfigSection[] = [
  {
    title: "Colors",
    description:
      "Series color palette. Colors cycle automatically when datasets exceed palette length.",
    rows: [
      {
        property: "colors",
        type: "string[]",
        default: '["#00a9ff", "#ffb840", ...]',
        description: "Color palette for dataset series",
      },
    ],
  },
  {
    title: "Font",
    description: "Base typography applied to axis labels and legend text.",
    rows: [
      { property: "font.family", type: "string", default: '"Noto Sans JP"' },
      { property: "font.size", type: "number", default: "11" },
    ],
  },
  {
    title: "Title",
    rows: [
      { property: "title.visible", type: "boolean", default: "true", description: "Show or hide the title" },
      { property: "title.color", type: "string", default: '"#000000"', description: "Text color" },
      { property: "title.fontSize", type: "number", default: "16", description: "Font size in px" },
      { property: "title.fontFamily", type: "string?", default: "\u2014", description: "Overrides font.family" },
      { property: "title.fontWeight", type: "string?", default: '"bold"', description: "Font weight" },
      { property: "title.position", type: '"top" | "bottom"', default: '"top"', description: "Placement relative to chart" },
      { property: "title.alignment", type: '"start" | "center" | "end"', default: '"center"', description: "Horizontal alignment" },
    ],
  },
  {
    title: "Legend",
    rows: [
      { property: "legend.visible", type: "boolean", default: "true" },
      { property: "legend.position", type: '"top" | "bottom"', default: '"bottom"' },
    ],
  },
  {
    title: "Axis",
    description: "Applies to both x-axis and y-axis.",
    rows: [
      { property: "axis.color", type: "string", default: '"#BBBBBB"', description: "Line and tick color" },
      { property: "axis.thickness", type: "number", default: "1", description: "Line thickness (px)" },
      { property: "axis.label.color", type: "string", default: '"#666666"', description: "Label text color" },
      { property: "axis.label.fontSize", type: "number", default: "11", description: "Label font size (px)" },
      { property: "axis.label.gap", type: "number", default: "8", description: "Gap between tick and label (px)" },
      { property: "axis.tick.size", type: "number", default: "6", description: "Tick mark length (px)" },
    ],
  },
  {
    title: "Grid",
    rows: [
      { property: "grid.color", type: "string", default: '"#EEEEEE"' },
      { property: "grid.thickness", type: "number", default: "1" },
    ],
  },
  {
    title: "Padding",
    description: "Chart area padding in pixels.",
    rows: [
      { property: "padding.top", type: "number", default: "30" },
      { property: "padding.right", type: "number", default: "20" },
      { property: "padding.bottom", type: "number", default: "40" },
      { property: "padding.left", type: "number", default: "60" },
    ],
  },
  {
    title: "Bar",
    rows: [
      { property: "bar.gap", type: "number", default: "1", description: "Horizontal margin between bars in a group (px)" },
      { property: "bar.cornerRadius", type: "number", default: "0", description: "Bar corner radius (px)" },
    ],
  },
  {
    title: "Animation",
    rows: [
      { property: "animation.enabled", type: "boolean", default: "true", description: "Enable entry animation" },
      { property: "animation.duration", type: "number", default: "300", description: "Duration per bar group (ms)" },
      { property: "animation.staggerDelay", type: "number", default: "60", description: "Delay between groups (ms)" },
    ],
  },
];

const barChartCustomElements = [
  { element: "layout", args: "{ title: Widget, legends: Widget[], plot: Widget }", description: "Overall chart layout — arranges title, legend, and plot area" },
  { element: "plot", args: "{ xAxis: Widget, yAxis: Widget, series: Widget, grid: Widget, axisCorner: Widget }", description: "Plot area — positions axes, series, and grid together" },
  { element: "title", args: "{ name: string }", description: "Chart title text rendering" },
  { element: "legend", args: "{ name: string, index: number }", description: "Individual legend item rendering" },
  { element: "series", args: "{ barGroups: Widget[] }", description: "Series container — wraps all bar groups" },
  { element: "barGroup", args: "{ bars: Widget[], index: number, label: string, values: number[] }", description: "Bar group — groups bars sharing the same category" },
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

// ---------------------------------------------------------------------------
// All chart pages
// ---------------------------------------------------------------------------

export const chartPages: ChartPageData[] = [
  // --- Bar Chart ---
  {
    slug: ["bar-chart"],
    title: "Bar Chart",
    description: "Compare quantities across categories with elegant, animated bars.",
    pageType: "overview",
    status: "available",
    code: { basic: barChartBasicCode },
  },
  {
    slug: ["bar-chart", "toast"],
    title: "Toast Style",
    description: "Clean, minimal bar chart with smooth staggered entry animations.",
    pageType: "style",
    status: "available",
    parent: "bar-chart",
    styleMeta: {
      tagline: "Clean, minimal, smooth animations",
      inspiration: "Inspired by Toast UI Chart",
      features: [
        "Staggered entry animations",
        "Vertical and horizontal directions",
        "Multi-dataset support",
        "Configurable colors, fonts, padding",
      ],
    },
    code: {
      basic: barChartBasicCode,
      config: barChartToastConfigCode,
      fullConfigType: toastFullConfigType,
      examples: toastExamples,
    },
    configSections: toastConfigSections,
  },
  {
    slug: ["bar-chart", "high"],
    title: "High Style",
    description: "Rich, detailed, expressive bar chart style.",
    pageType: "style",
    status: "coming",
    parent: "bar-chart",
    styleMeta: {
      tagline: "Rich, detailed, expressive",
      inspiration: "Inspired by Highcharts' classic style",
      features: [],
    },
  },
  {
    slug: ["bar-chart", "advanced"],
    title: "Bar Chart \u2014 Advanced",
    description: "Custom renderers and headless architecture for bar charts.",
    pageType: "advanced",
    status: "available",
    parent: "bar-chart",
    code: {
      basic: `import { BarChart } from "@flitterjs/chart";

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
});`,
    },
    customElements: barChartCustomElements,
  },

  // --- Coming Soon charts ---
  ...[
    { slug: "line-chart", title: "Line Chart", desc: "Visualize trends and changes over time with smooth, interactive lines." },
    { slug: "area-chart", title: "Area Chart", desc: "Show volume and trends with filled area beneath the line." },
    { slug: "pie-chart", title: "Pie Chart", desc: "Show proportions and percentages with beautifully segmented circles." },
    { slug: "scatter-chart", title: "Scatter Chart", desc: "Plot individual data points to reveal correlations and distributions." },
    { slug: "radar-chart", title: "Radar Chart", desc: "Display multivariate data on a radial grid for instant comparison." },
    { slug: "bubble-chart", title: "Bubble Chart", desc: "Visualize three dimensions of data with positioned, sized bubbles." },
    { slug: "heatmap-chart", title: "Heatmap Chart", desc: "Represent data intensity through color-coded grid cells." },
    { slug: "candlestick-chart", title: "Candlestick Chart", desc: "Track open, high, low, close values for financial data." },
    { slug: "box-plot-chart", title: "Box Plot Chart", desc: "Display statistical distribution with quartiles and outliers." },
    { slug: "waterfall-chart", title: "Waterfall Chart", desc: "Show cumulative effect of sequential positive and negative values." },
    { slug: "funnel-chart", title: "Funnel Chart", desc: "Visualize stages in a process with decreasing values." },
    { slug: "gauge-chart", title: "Gauge Chart", desc: "Display a single value within a range on a dial." },
    { slug: "treemap-chart", title: "Treemap Chart", desc: "Represent hierarchical data as nested proportional rectangles." },
    { slug: "sunburst-chart", title: "Sunburst Chart", desc: "Display hierarchical data as concentric rings." },
    { slug: "sankey-chart", title: "Sankey Chart", desc: "Show flow and quantity between nodes with weighted links." },
    { slug: "stacked-bar-chart", title: "Stacked Bar Chart", desc: "Compare totals and composition across categories." },
    { slug: "stacked-area-chart", title: "Stacked Area Chart", desc: "Show cumulative totals over time with layered areas." },
  ].map(
    (c): ChartPageData => ({
      slug: [c.slug],
      title: c.title,
      description: c.desc,
      pageType: "overview",
      status: "coming",
    })
  ),
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function findChartPage(slug: string[]): ChartPageData | undefined {
  return chartPages.find(
    (p) => p.slug.length === slug.length && p.slug.every((s, i) => s === slug[i])
  );
}

export function getChildPages(parentSlug: string): ChartPageData[] {
  return chartPages.filter((p) => p.parent === parentSlug);
}

export function getAllSlugs(): string[][] {
  return chartPages.map((p) => p.slug);
}
