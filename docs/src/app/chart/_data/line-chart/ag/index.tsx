import { agStylePage } from "../../styles/ag";
import {
  DefaultAgLineChart,
  SplineAgLineChart,
  StockPriceAgLineChart,
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

export const agStyle = agStylePage("line-chart", {
  extraConfigSections: lineConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultAgLineChart />,
      code: `import LineChart from "./charts/line-chart";
import Widget from "@flitterjs/react";

const chart = LineChart({
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
      chart: <SplineAgLineChart />,
      code: `import LineChart from "./charts/line-chart";
import Widget from "@flitterjs/react";

const chart = LineChart({
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
      title: "Stock Prices",
      chart: <StockPriceAgLineChart />,
      code: `import LineChart from "./charts/line-chart";
import Widget from "@flitterjs/react";

const chart = LineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "AAPL", values: [185, 190, 178, 195, 188, 210, 225, 218, 230, 222, 240, 248] },
      { legend: "GOOGL", values: [140, 145, 138, 150, 155, 162, 158, 170, 175, 168, 180, 188] },
      { legend: "MSFT", values: [375, 382, 370, 390, 398, 410, 420, 415, 430, 425, 440, 455] },
    ],
  },
  config: { line: { strokeWidth: 2 } },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
