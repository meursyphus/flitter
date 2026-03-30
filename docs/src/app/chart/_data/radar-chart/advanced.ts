import type { AdvancedPageData } from "../types";

const advancedCode = `import RadarChart from "./charts/radar-chart";

RadarChart({
  data: { /* ... */ },
  custom: {
    radar: (args, context) => {
      // args: { legend, index, vertices: RadarVertex[] }
      //   RadarVertex: { nx, ny, angle, ratio, value, label, index }
      // context: RadarChartController & { config }
      //   - context.data, context.scale
      //   - context.width, context.height, context.legends
      //   - context.toggleSeries(), ...
      // Return any Flitter Widget
    },
  },
});`;

const customElements = [
  { element: "layout", args: "{ title: Widget, legends: Widget[], plot: Widget }", description: "Overall chart layout — arranges title, legend, and plot area" },
  { element: "plot", args: "{ angularAxis: Widget, radialAxis: Widget, dataView: Widget }", description: "Plot area — positions angular axis, radial axis, and data view together" },
  { element: "title", args: "undefined", description: "Chart title text rendering" },
  { element: "legend", args: "{ name: string, index: number }", description: "Individual legend item rendering" },
  { element: "angularAxis", args: "{ line: Widget, labels: Widget[] }", description: "Angular axis container — assembles spoke lines and category labels" },
  { element: "angularAxisLine", args: "{ axisCount: number }", description: "Angular axis spoke lines radiating from center" },
  { element: "angularAxisLabel", args: "{ index: number, label: string, angle: number, nx: number, ny: number }", description: "Individual category label on the angular axis" },
  { element: "radialAxis", args: "{ line: Widget, labels: Widget[] }", description: "Radial axis container — assembles concentric polygons and scale labels" },
  { element: "radialAxisLine", args: "{ levels: number, axisCount: number }", description: "Concentric polygon grid lines" },
  { element: "radialAxisLabel", args: "{ value: number, index: number }", description: "Scale value label on the radial axis" },
  { element: "dataView", args: "{ radars: Widget[] }", description: "Data view container — wraps all radar polygon widgets" },
  { element: "radar", args: "{ legend: string, index: number, vertices: RadarVertex[] }", description: "Individual radar polygon — vertices include { nx, ny, angle, ratio, value, label, index }" },
];

export const advancedPage: AdvancedPageData = {
  slug: ["radar-chart", "advanced"],
  title: "Radar Chart — Advanced",
  description: "Custom renderers and headless architecture for radar charts.",
  pageType: "advanced",
  parent: "radar-chart",
  code: { basic: advancedCode },
  customElements,
  scenarios: [
    {
      title: "Skill Comparison",
      description: "Overlay multiple team or candidate profiles on one radar chart. Each polygon renderer receives its vertex array — apply distinct fill colors with low opacity and contrasting stroke widths so overlapping regions reveal relative strengths at a glance.",
    },
    {
      title: "Custom Vertex Markers",
      description: "Replace default vertex dots with score badges, star ratings, or category icons. The radar renderer receives all vertex positions as { nx, ny, angle, ratio, value } — place any widget at each computed coordinate using Positioned in a Stack.",
    },
    {
      title: "Highlighted Axes",
      description: "Emphasize specific axes by changing spoke color, width, or adding a background wedge. Override angularAxisLine to draw select spokes in an accent color — useful for spotlighting the most important evaluation dimensions.",
    },
    {
      title: "Filled vs Outline Toggle",
      description: "Let users toggle between filled polygons and outline-only mode per series. Track the display mode in a StatefulWidget and conditionally set fill opacity to 0 in the radar renderer while keeping the stroke visible.",
    },
    {
      title: "Interactive Axis Labels",
      description: "Make category labels clickable to sort the data, toggle axis visibility, or open detail panels. The angularAxisLabel renderer is a full widget factory — wrap each label in GestureDetector and style the active label with a bold font weight or underline.",
    },
    {
      title: "Animated Profile Morph",
      description: "Smoothly animate between two data profiles when the user switches datasets. Use an AnimationController with Tween to interpolate each vertex ratio from the old values to the new ones, then rebuild the radar polygon on each animation frame.",
    },
  ],
};
