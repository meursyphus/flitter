import { toastStylePage } from "../../styles/toast";
import {
  VerticalToastBarChart,
  HorizontalToastBarChart,
  NegativeVerticalToastBarChart,
  NegativeHorizontalToastBarChart,
} from "./examples";

const barConfigSections = [
  {
    title: "Bar",
    rows: [
      { property: "bar.gap", type: "number", default: "1", description: "Horizontal margin between bars in a group (px)" },
      { property: "bar.cornerRadius", type: "number", default: "0", description: "Bar corner radius (px)" },
    ],
  },
];

export const toastStyle = toastStylePage("bar-chart", {
  extraConfigSections: barConfigSections,
  examples: [
    {
      title: "Vertical",
      chart: <VerticalToastBarChart />,
      code: `import Widget from "@flitterjs/react";
import ToastBarChart from "./charts/toast-bar-chart";

const chart = ToastBarChart({
  direction: "vertical",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { legend: "North America", values: [4.2, 4.8, 3.9, 5.1, 5.6, 5.3] },
      { legend: "Europe", values: [3.1, 2.9, 3.4, 3.2, 3.8, 3.6] },
      { legend: "Asia Pacific", values: [2.1, 2.5, 2.3, 2.8, 2.6, 3.0] },
    ],
  },
  config: { colors: ["#0d9488", "#14b8a6", "#99f6e4"] },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Horizontal",
      chart: <HorizontalToastBarChart />,
      code: `import Widget from "@flitterjs/react";
import ToastBarChart from "./charts/toast-bar-chart";

const chart = ToastBarChart({
  direction: "horizontal",
  data: {
    labels: [
      "Ease of Use", "Performance", "Documentation",
      "Design Quality", "Support", "Value for Money",
    ],
    datasets: [{ legend: "Score (%)", values: [92, 87, 78, 95, 71, 84] }],
  },
  config: { colors: ["#f59e0b"] },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Negative Vertical",
      chart: <NegativeVerticalToastBarChart />,
      code: `import Widget from "@flitterjs/react";
import ToastBarChart from "./charts/toast-bar-chart";

const chart = ToastBarChart({
  direction: "vertical",
  data: {
    labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25"],
    datasets: [
      { legend: "Net Income", values: [32, -18, 45, -7, 28, -12] },
      { legend: "Operating Cash", values: [15, 22, -10, 38, -25, 19] },
    ],
  },
  config: { colors: ["#10b981", "#ef4444"] },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Negative Horizontal",
      chart: <NegativeHorizontalToastBarChart />,
      code: `import Widget from "@flitterjs/react";
import ToastBarChart from "./charts/toast-bar-chart";

const chart = ToastBarChart({
  direction: "horizontal",
  data: {
    labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25"],
    datasets: [
      { legend: "Net Income", values: [32, -18, 45, -7, 28, -12] },
      { legend: "Operating Cash", values: [15, 22, -10, 38, -25, 19] },
    ],
  },
  config: { colors: ["#10b981", "#ef4444"] },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
