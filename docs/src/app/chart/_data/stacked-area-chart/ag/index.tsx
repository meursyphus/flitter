import { agStylePage } from "../../styles/ag";
import { DefaultAgStackedAreaChart } from "./examples";

const areaConfigSections = [
  {
    title: "Area",
    rows: [
      { property: "area.opacity", type: "number", default: "0.7", description: "Fill opacity of stacked areas" },
      { property: "area.strokeWidth", type: "number", default: "2", description: "Stroke width of area outlines (px)" },
      { property: "area.spline", type: "boolean", default: "false", description: "Use spline interpolation for smooth curves" },
    ],
  },
];

export const agStyle = agStylePage("stacked-area-chart", {
  extraConfigSections: areaConfigSections,
  examples: [
    { title: "Default", chart: <DefaultAgStackedAreaChart /> },
  ],
});
