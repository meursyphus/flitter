import type { AdvancedPageData } from "../types";

const advancedCode = `import { RadarChart } from "@flitterjs/chart";

RadarChart({
  style: "toast",
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
};
