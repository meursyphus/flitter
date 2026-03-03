import type { AdvancedPageData } from "../types";

const advancedCode = `import { PieChart } from "@flitterjs/chart";

PieChart({
  style: "toast",
  data: { /* ... */ },
  custom: {
    slice: (args, context) => {
      // args: { index, name, value, percentage, sweepAngle }
      // context: PieChartController & { config }
      //   - context.data, context.scale
      //   - context.width, context.height
      //   - context.toggleSeries(), ...
      // Return any Flitter Widget
    },
  },
});`;

const customElements = [
  { element: "layout", args: "{ title: Widget, legends: Widget[], dataView: Widget }", description: "Overall chart layout — arranges title, legend, and pie area" },
  { element: "dataView", args: "{ slices: { widget: Widget, startAngle: number, sweepAngle: number, percentage: number, index: number, name: string, value: number }[] }", description: "Pie container — wraps all slice widgets with angle and value metadata" },
  { element: "slice", args: "{ index: number, name: string, value: number, percentage: number, sweepAngle: number }", description: "Individual pie slice element" },
  { element: "legend", args: "{ name: string, index: number }", description: "Individual legend item rendering" },
  { element: "title", args: "undefined", description: "Chart title text rendering" },
];

export const advancedPage: AdvancedPageData = {
  slug: ["pie-chart", "advanced"],
  title: "Pie Chart — Advanced",
  description: "Custom renderers and headless architecture for pie charts.",
  pageType: "advanced",
  parent: "pie-chart",
  code: { basic: advancedCode },
  customElements,
};
