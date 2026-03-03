import { toastStylePage } from "../../styles/toast";
import { DefaultToastStackedAreaChart } from "./examples";

const areaConfigSections = [
  {
    title: "Area",
    rows: [
      { property: "area.opacity", type: "number", default: "0.6", description: "Fill opacity of stacked areas" },
      { property: "area.strokeWidth", type: "number", default: "2", description: "Stroke width of area outlines (px)" },
      { property: "area.spline", type: "boolean", default: "false", description: "Use spline interpolation for smooth curves" },
    ],
  },
];

export const toastStyle = toastStylePage("stacked-area-chart", {
  extraConfigSections: areaConfigSections,
  examples: [
    { title: "Default", chart: <DefaultToastStackedAreaChart /> },
  ],
});
