import { agStylePage } from "../../styles/ag";
import {
  VerticalAgBarChart,
  HorizontalAgBarChart,
  NegativeVerticalAgBarChart,
  NegativeHorizontalAgBarChart,
} from "./examples";

const barConfigSections = [
  {
    title: "Bar",
    rows: [
      { property: "bar.gap", type: "number", default: "1", description: "Gap between bars in a group (px)" },
      { property: "bar.cornerRadius", type: "number", default: "0", description: "Bar corner radius (px)" },
    ],
  },
];

export const agStyle = agStylePage("bar-chart", {
  extraConfigSections: barConfigSections,
  examples: [
    {
      title: "Vertical",
      chart: <VerticalAgBarChart />,
      code: `import Widget from "@flitterjs/react";
import BarChart from "./charts/bar-chart";

const chart = BarChart({
  direction: "vertical",
  data: {
    labels: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
    datasets: [
      { legend: "Revenue", values: [28.5, 31.2, 29.8, 34.1] },
      { legend: "EBITDA", values: [8.4, 9.7, 8.9, 11.2] },
    ],
  },
  config: {
    colors: { fills: ["#2563eb", "#7c3aed"] },
    bar: { cornerRadius: 4 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Horizontal",
      chart: <HorizontalAgBarChart />,
      code: `import Widget from "@flitterjs/react";
import BarChart from "./charts/bar-chart";

const chart = BarChart({
  direction: "horizontal",
  data: {
    labels: [
      "United States", "China", "Japan", "Germany", "India",
      "United Kingdom", "France", "Brazil", "Canada", "South Korea",
    ],
    datasets: [
      {
        legend: "GDP (T$)",
        values: [25.5, 17.9, 4.2, 4.1, 3.7, 3.1, 2.8, 1.9, 1.8, 1.7],
      },
    ],
  },
  config: {
    colors: { fills: ["#0284c7"] },
    bar: { cornerRadius: 3 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Negative Vertical",
      chart: <NegativeVerticalAgBarChart />,
      code: `import Widget from "@flitterjs/react";
import BarChart from "./charts/bar-chart";

const chart = BarChart({
  direction: "vertical",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        legend: "Monthly P&L ($K)",
        values: [120, -45, 85, -20, 150, -80, 65, 110],
      },
    ],
  },
  config: {
    colors: { fills: ["#6366f1"] },
    bar: { cornerRadius: 3 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Negative Horizontal",
      chart: <NegativeHorizontalAgBarChart />,
      code: `import Widget from "@flitterjs/react";
import BarChart from "./charts/bar-chart";

const chart = BarChart({
  direction: "vertical",
  data: {
    labels: ["Enterprise", "Mid-Market", "SMB", "Startup"],
    datasets: [
      { legend: "New ARR ($K)", values: [480, 320, 190, 85] },
      { legend: "Expansion ($K)", values: [210, 145, 70, 32] },
      { legend: "Churn ($K)", values: [-95, -68, -42, -28] },
    ],
  },
  config: {
    colors: { fills: ["#10b981", "#3b82f6", "#ef4444"] },
    bar: { cornerRadius: 4 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
