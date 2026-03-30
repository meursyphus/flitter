import type { AdvancedPageData } from "../types";

const advancedCode = `import PieChart from "./charts/pie-chart";

PieChart({
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
  scenarios: [
    {
      title: "Exploded Segments",
      description: "Pull out a selected slice on click with a radial offset animation. Wrap the slice renderer in GestureDetector and use AnimatedPositioned to translate the slice outward along its bisector angle — the args provide sweepAngle and startAngle for trigonometry.",
    },
    {
      title: "Rich Slice Labels",
      description: "Place formatted labels inside large slices and outside small ones with leader lines. The slice renderer receives percentage and value — conditionally return a Stack with the slice arc and a Positioned text widget, or an external label with a CustomPaint connector line.",
    },
    {
      title: "Donut Center Content",
      description: "Render a total count, KPI metric, icon, or interactive toggle in the donut hole. Override the dataView renderer to wrap all slices in a Stack and place a centered Column widget with Text, formatted numbers, or even a mini sparkline.",
    },
    {
      title: "Nested Rings",
      description: "Stack multiple pie layers as concentric rings for hierarchical data. Override the dataView renderer to compose two or more pie widgets at different radii — each ring gets its own data array, color palette, and independent slice renderers.",
    },
    {
      title: "Hover Expansion",
      description: "Enlarge a slice on hover with a smooth AnimatedScale transition. Track the hovered index in a StatefulWidget, then in the slice renderer compare the current index to apply a scale factor of 1.08 with Curves.easeOut for a polished micro-interaction.",
    },
    {
      title: "Category Drill-Down",
      description: "Click a slice to break it into sub-categories with an animated transition. Use setState() to replace the data array and re-render the entire pie. Add AnimationController for a smooth morph between parent and child category views.",
    },
  ],
};
