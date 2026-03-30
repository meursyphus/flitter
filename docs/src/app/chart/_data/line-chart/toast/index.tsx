import { toastStylePage } from "../../styles/toast";
import {
  DefaultToastLineChart,
  SplineToastLineChart,
  MultiMetricToastLineChart,
} from "./examples";

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
      chart: <DefaultToastLineChart />,
      code: `import ToastLineChart from "./charts/toast-line-chart";
import Widget from "@flitterjs/react";

const chart = ToastLineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Housing starts (MoM %)", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
      { legend: "Unemployment rate", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
      { legend: "CPI MoM", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.70, 8.99, 8.97, 10.76] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Spline",
      chart: <SplineToastLineChart />,
      code: `import ToastLineChart from "./charts/toast-line-chart";
import Widget from "@flitterjs/react";

const chart = ToastLineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { legend: "Series A", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84] },
      { legend: "Series B", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5] },
    ],
  },
  config: {
    line: { spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Multi-Metric",
      chart: <MultiMetricToastLineChart />,
      code: `import ToastLineChart from "./charts/toast-line-chart";
import Widget from "@flitterjs/react";

const chart = ToastLineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Revenue ($K)", values: [120, 135, 128, 142, 155, 148, 162, 170, 165, 178, 185, 195] },
      { legend: "Users (K)", values: [45, 52, 58, 63, 70, 75, 82, 88, 92, 98, 105, 112] },
      { legend: "Conversion (%)", values: [3.2, 3.5, 3.1, 3.8, 4.0, 3.6, 4.2, 4.5, 4.1, 4.6, 4.8, 5.0] },
      { legend: "Churn (%)", values: [2.8, 2.5, 2.9, 2.3, 2.1, 2.4, 2.0, 1.8, 2.2, 1.9, 1.7, 1.5] },
    ],
  },
  config: { line: { strokeWidth: 2 } },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
