import { toastStylePage } from "../../styles/toast";
import {
  DefaultToastScatterChart,
  FilledToastScatterChart,
  LargeToastScatterChart,
} from "./examples";

const scatterConfigSections = [
  {
    title: "Scatter",
    rows: [
      { property: "scatter.size", type: "number", default: "10", description: "Point diameter (px)" },
      { property: "scatter.fill", type: "boolean", default: "false", description: "Fill points with color (true) or stroke only (false)" },
      { property: "scatter.strokeWidth", type: "number", default: "2", description: "Stroke width when fill is false (px)" },
    ],
  },
];

export const toastStyle = toastStylePage("scatter-chart", {
  extraConfigSections: scatterConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultToastScatterChart />,
      code: `import ToastScatterChart from "./charts/toast-scatter-chart";
import Widget from "@flitterjs/react";

const chart = ToastScatterChart({
  data: {
    datasets: [
      {
        legend: "Africa",
        data: [
          { x: 4200, y: 70.35, label: "Morocco" },
          { x: 6600, y: 72.74, label: "Algeria" },
          { x: 7100, y: 74.66, label: "Tunisia" },
        ],
      },
      {
        legend: "America",
        data: [
          { x: 8100, y: 71.41, label: "Brazil" },
          { x: 31500, y: 79.96, label: "Canada" },
          { x: 32100, y: 77.43, label: "United States" },
        ],
      },
      {
        legend: "Europe",
        data: [
          { x: 28700, y: 78.54, label: "Germany" },
          { x: 28700, y: 79.44, label: "France" },
          { x: 29600, y: 78.27, label: "United Kingdom" },
        ],
      },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Filled",
      chart: <FilledToastScatterChart />,
      code: `import ToastScatterChart from "./charts/toast-scatter-chart";
import Widget from "@flitterjs/react";

const chart = ToastScatterChart({
  data: {
    datasets: [
      {
        legend: "Group A",
        data: [
          { x: 5600, y: 71.96, label: "China" },
          { x: 19200, y: 75.58, label: "Korea" },
          { x: 29400, y: 81.04, label: "Japan" },
        ],
      },
    ],
  },
  config: {
    scatter: { fill: true, size: 8 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Large Points",
      chart: <LargeToastScatterChart />,
      code: `import ToastScatterChart from "./charts/toast-scatter-chart";
import Widget from "@flitterjs/react";

const chart = ToastScatterChart({
  data: {
    datasets: [
      {
        legend: "Group A",
        data: [
          { x: 5600, y: 71.96, label: "China" },
          { x: 19200, y: 75.58, label: "Korea" },
          { x: 29400, y: 81.04, label: "Japan" },
        ],
      },
    ],
  },
  config: {
    scatter: { size: 16, strokeWidth: 3 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
