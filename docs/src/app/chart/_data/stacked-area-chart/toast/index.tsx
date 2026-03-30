import { toastStylePage } from "../../styles/toast";
import { DefaultToastStackedAreaChart, TrafficSourceStackedArea, RevenueStreamStackedArea } from "./examples";

const areaConfigSections = [
  {
    title: "Area",
    rows: [
      { property: "area.opacity", type: "number", default: "0.6", description: "Fill opacity of stacked areas" },
      { property: "area.strokeWidth", type: "number", default: "2", description: "Stroke width of area outlines (px)" },
      { property: "area.spline", type: "boolean", default: "false", description: "Use spline interpolation for smooth curves" },
    ],
  },
];

export const toastStyle = toastStylePage("stacked-area-chart", {
  extraConfigSections: areaConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultToastStackedAreaChart />,
      code: `import ToastStackedAreaChart from "./charts/toast-stacked-area-chart";
import Widget from "@flitterjs/react";

const chart = ToastStackedAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Organic", values: [400, 450, 420, 480, 520, 510, 550, 530, 560, 600, 620, 650] },
      { legend: "Direct", values: [200, 220, 210, 230, 250, 240, 260, 255, 270, 290, 300, 310] },
      { legend: "Social", values: [100, 120, 130, 140, 160, 155, 170, 165, 180, 200, 210, 220] },
      { legend: "Referral", values: [50, 60, 55, 65, 70, 75, 80, 78, 85, 90, 95, 100] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Traffic by Source",
      chart: <TrafficSourceStackedArea />,
      code: `import ToastStackedAreaChart from "./charts/toast-stacked-area-chart";
import Widget from "@flitterjs/react";

const chart = ToastStackedAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Search", values: [3200, 3400, 3600, 3900, 4100, 4300, 4500, 4200, 4600, 4800, 5000, 5200] },
      { legend: "Social Media", values: [800, 950, 1100, 1300, 1500, 1800, 2000, 2200, 1900, 1700, 1600, 1400] },
      { legend: "Email", values: [600, 580, 620, 650, 700, 680, 720, 710, 750, 780, 800, 820] },
      { legend: "Direct", values: [1200, 1250, 1300, 1280, 1350, 1400, 1380, 1420, 1450, 1500, 1520, 1550] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Revenue Streams",
      chart: <RevenueStreamStackedArea />,
      code: `import ToastStackedAreaChart from "./charts/toast-stacked-area-chart";
import Widget from "@flitterjs/react";

const chart = ToastStackedAreaChart({
  data: {
    labels: ["Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23", "Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24"],
    datasets: [
      { legend: "Subscriptions", values: [4200, 4500, 4800, 5100, 5500, 5900, 6300, 6800] },
      { legend: "Licensing", values: [1800, 1900, 2000, 2200, 2100, 2300, 2500, 2700] },
      { legend: "Services", values: [900, 1000, 1100, 1200, 1300, 1400, 1500, 1600] },
      { legend: "Hardware", values: [600, 550, 500, 700, 650, 600, 750, 800] },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
