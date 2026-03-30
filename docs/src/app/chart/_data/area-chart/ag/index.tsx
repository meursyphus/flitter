import { agStylePage } from "../../styles/ag";
import {
  DefaultAgAreaChart,
  SplineAgAreaChart,
} from "./examples";

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
      chart: <DefaultAgAreaChart />,
      code: `import AreaChart from "./charts/area-chart";
import Widget from "@flitterjs/react";

const chart = AreaChart({
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
      chart: <SplineAgAreaChart />,
      code: `import AreaChart from "./charts/area-chart";
import Widget from "@flitterjs/react";

const chart = AreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { legend: "Series A", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84] },
      { legend: "Series B", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5] },
    ],
  },
  config: {
    area: { spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
