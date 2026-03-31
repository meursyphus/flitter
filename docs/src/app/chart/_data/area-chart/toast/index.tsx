import { toastStylePage } from "../../styles/toast";
import {
  DefaultToastAreaChart,
  SplineToastAreaChart,
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

export const toastStyle = toastStylePage("area-chart", {
  extraConfigSections: areaConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultToastAreaChart.Component />,
      code: DefaultToastAreaChart.code,
    },
    {
      title: "Spline",
      chart: <SplineToastAreaChart.Component />,
      code: SplineToastAreaChart.code,
    },
  ],
});
