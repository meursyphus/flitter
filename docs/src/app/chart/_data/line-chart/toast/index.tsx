import { toastStylePage } from "../../styles/toast";
import {
  DefaultToastLineChart,
  SplineToastLineChart,
  MultiMetricToastLineChart,
} from "./examples.generated";

const lineConfigSections = [
  {
    title: "Line",
    rows: [
      { property: "line.strokeWidth", type: "number", default: "2", description: "Line stroke width (px)" },
      { property: "line.spline", type: "boolean", default: "false", description: "Use spline (curved) interpolation" },
    ],
  },
];

export const toastStyle = toastStylePage("line-chart", {
  extraConfigSections: lineConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultToastLineChart.Component />,
      code: DefaultToastLineChart.code,
    },
    {
      title: "Spline",
      chart: <SplineToastLineChart.Component />,
      code: SplineToastLineChart.code,
    },
    {
      title: "Multi-Metric",
      chart: <MultiMetricToastLineChart.Component />,
      code: MultiMetricToastLineChart.code,
    },
  ],
});
