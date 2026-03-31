import { agStylePage } from "../../styles/ag";
import {
  DefaultAgAreaChart,
  SplineAgAreaChart,
} from "./examples.generated";

const areaConfigSections = [
  {
    title: "Area",
    rows: [
      { property: "area.strokeWidth", type: "number", default: "2", description: "Area border stroke width (px)" },
      { property: "area.opacity", type: "number", default: "0.3", description: "Fill opacity (0–1)" },
      { property: "area.spline", type: "boolean", default: "false", description: "Use spline (curved) interpolation" },
    ],
  },
];

export const agStyle = agStylePage("area-chart", {
  extraConfigSections: areaConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultAgAreaChart.Component />,
      code: DefaultAgAreaChart.code,
    },
    {
      title: "Spline",
      chart: <SplineAgAreaChart.Component />,
      code: SplineAgAreaChart.code,
    },
  ],
});
