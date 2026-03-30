import { agStylePage } from "../../styles/ag";
import {
  VerticalAgStackedBarChart,
  HorizontalAgStackedBarChart,
  NegativeVerticalAgStackedBarChart,
  NegativeHorizontalAgStackedBarChart,
} from "./examples";

const barConfigSections = [
  {
    title: "Bar",
    rows: [
      { property: "bar.gap", type: "number", default: "0", description: "Gap between stacked bar groups (px)" },
    ],
  },
];

export const agStyle = agStylePage("stacked-bar-chart", {
  extraConfigSections: barConfigSections,
  examples: [
    {
      title: "Vertical",
      chart: <VerticalAgStackedBarChart />,
      code: `import StackedBarChart from "./charts/stacked-bar-chart";
import Widget from "@flitterjs/react";

const chart = StackedBarChart({
  direction: "vertical",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
      { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
      { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Horizontal",
      chart: <HorizontalAgStackedBarChart />,
      code: `import StackedBarChart from "./charts/stacked-bar-chart";
import Widget from "@flitterjs/react";

const chart = StackedBarChart({
  direction: "horizontal",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
      { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
      { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Negative Vertical",
      chart: <NegativeVerticalAgStackedBarChart />,
      code: `import StackedBarChart from "./charts/stacked-bar-chart";
import Widget from "@flitterjs/react";

const chart = StackedBarChart({
  direction: "vertical",
  data: {
    labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25"],
    datasets: [
      { legend: "Product A", values: [-20, 15, -5, 30, -10, 25, 8] },
      { legend: "Product B", values: [10, -12, 22, -8, 18, -15, 30] },
      { legend: "Product C", values: [5, -25, 12, 20, -18, 10, -7] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Negative Horizontal",
      chart: <NegativeHorizontalAgStackedBarChart />,
      code: `import StackedBarChart from "./charts/stacked-bar-chart";
import Widget from "@flitterjs/react";

const chart = StackedBarChart({
  direction: "horizontal",
  data: {
    labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25"],
    datasets: [
      { legend: "Product A", values: [-20, 15, -5, 30, -10, 25, 8] },
      { legend: "Product B", values: [10, -12, 22, -8, 18, -15, 30] },
      { legend: "Product C", values: [5, -25, 12, 20, -18, 10, -7] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
