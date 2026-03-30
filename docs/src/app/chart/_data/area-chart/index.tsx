import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  DefaultToastAreaChart,
  SplineToastAreaChart,
  RevenueGrowthToastArea,
  NetworkTrafficToastArea,
  UserEngagementToastArea,
  EnergyConsumptionToastArea,
} from "./toast/examples";
import {
  DefaultAgAreaChart,
  SplineAgAreaChart,
  CloudUsageAgArea,
  AppPerformanceAgArea,
  QuarterlyRevenueAgArea,
} from "./ag/examples";
import { advancedPage } from "./advanced";

const basicCode = `import AreaChart from "./charts/area-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = AreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      { legend: "Revenue", values: [40, 65, 50, 80] },
    ],
  },
});

// Render with React
<Widget widget={chart} width={600} height={400} />`;

const showcaseExamples: ShowcaseExample[] = [
  {
    title: "Market Indicators Overview",
    subtitle: "Housing, employment, and CPI trends with filled areas",
    style: "Toast" as const,
    chart: <DefaultToastAreaChart />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastAreaChart from "./charts/toast-area-chart";

const chart = ToastAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Housing starts", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
      { legend: "Unemployment", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
      { legend: "CPI MoM", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.70, 8.99, 8.97, 10.76] },
    ],
  },
  config: { area: { strokeWidth: 2, opacity: 0.3 } },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Revenue Growth",
    subtitle: "Quarterly revenue vs costs showing expanding margins",
    style: "Toast" as const,
    chart: <RevenueGrowthToastArea />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastAreaChart from "./charts/toast-area-chart";

const chart = ToastAreaChart({
  data: {
    labels: ["Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23", "Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24"],
    datasets: [
      { legend: "Revenue ($M)", values: [4.2, 4.8, 5.1, 5.9, 6.3, 7.0, 7.5, 8.2] },
      { legend: "Costs ($M)", values: [3.1, 3.4, 3.6, 3.8, 4.0, 4.2, 4.3, 4.5] },
    ],
  },
  config: {
    colors: ["#10b981", "#f43f5e"],
    area: { strokeWidth: 2, opacity: 0.4 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Smooth Revenue Forecast",
    subtitle: "Spline curves for polished financial reporting",
    style: "AG" as const,
    chart: <SplineAgAreaChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import AreaChart from "./charts/area-chart";

const chart = AreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Revenue", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
      { legend: "Forecast", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
    ],
  },
  config: {
    colors: { fills: ["#7c3aed", "#0ea5e9"], strokes: ["#7c3aed", "#0ea5e9"] },
    grid: { dash: [4, 4] },
    area: { strokeWidth: 2, opacity: 0.2, spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Network Traffic",
    subtitle: "Inbound and outbound bandwidth over 24 hours with smooth curves",
    style: "Toast" as const,
    chart: <NetworkTrafficToastArea />,
    featured: true,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import ToastAreaChart from "./charts/toast-area-chart";

const chart = ToastAreaChart({
  data: {
    labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
    datasets: [
      { legend: "Inbound (Gbps)", values: [2.1, 1.4, 0.8, 0.6, 1.8, 4.5, 6.2, 7.8, 8.1, 6.9, 5.2, 3.4] },
      { legend: "Outbound (Gbps)", values: [1.8, 1.1, 0.5, 0.4, 1.5, 3.8, 5.5, 6.9, 7.2, 6.1, 4.5, 2.9] },
    ],
  },
  config: {
    colors: ["#3b82f6", "#f97316"],
    area: { strokeWidth: 1.5, opacity: 0.15, spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Cloud Infrastructure Costs",
    subtitle: "Compute, storage, and network spend across 12 months",
    style: "AG" as const,
    chart: <CloudUsageAgArea />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import AreaChart from "./charts/area-chart";

const chart = AreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Compute ($K)", values: [12.5, 13.2, 14.8, 16.1, 18.5, 21.0, 23.4, 25.8, 24.2, 22.0, 19.5, 17.8] },
      { legend: "Storage ($K)", values: [5.2, 5.5, 5.9, 6.4, 7.0, 7.6, 8.2, 8.8, 9.2, 9.6, 10.0, 10.4] },
      { legend: "Network ($K)", values: [3.1, 3.4, 3.8, 4.2, 4.9, 5.8, 6.5, 7.2, 6.8, 5.9, 5.0, 4.2] },
    ],
  },
  config: {
    colors: { fills: ["#3b82f6", "#f59e0b", "#10b981"], strokes: ["#3b82f6", "#f59e0b", "#10b981"] },
    background: "#f8fafc",
    area: { strokeWidth: 2, opacity: 0.25 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "User Engagement Metrics",
    subtitle: "DAU, WAU, and MAU growth over 12 months",
    style: "Toast" as const,
    chart: <UserEngagementToastArea />,
    featured: true,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import ToastAreaChart from "./charts/toast-area-chart";

const chart = ToastAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "DAU (K)", values: [12, 14, 15, 18, 22, 25, 28, 30, 27, 32, 35, 40] },
      { legend: "WAU (K)", values: [45, 50, 55, 62, 70, 78, 85, 90, 82, 95, 102, 115] },
      { legend: "MAU (K)", values: [120, 130, 140, 155, 175, 195, 210, 225, 215, 240, 260, 290] },
    ],
  },
  config: {
    colors: ["#6366f1", "#ec4899", "#f59e0b"],
    legend: { position: "right-top" },
    area: { strokeWidth: 2.5, opacity: 0.25 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "App Performance Monitor",
    subtitle: "CPU and memory utilization over 24 hours with spline smoothing",
    style: "AG" as const,
    chart: <AppPerformanceAgArea />,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import AreaChart from "./charts/area-chart";

const chart = AreaChart({
  data: {
    labels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
             "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
             "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    datasets: [
      { legend: "CPU (%)", values: [15, 12, 10, 8, 9, 11, 22, 45, 68, 72, 75, 78, 80, 76, 74, 70, 65, 58, 42, 35, 28, 22, 18, 16] },
      { legend: "Memory (%)", values: [42, 40, 38, 37, 37, 38, 45, 55, 65, 70, 72, 74, 75, 73, 72, 70, 68, 62, 55, 50, 48, 45, 43, 42] },
    ],
  },
  config: {
    colors: { fills: ["#ef4444", "#6366f1"], strokes: ["#ef4444", "#6366f1"] },
    grid: { dash: [2, 2] },
    area: { strokeWidth: 1.5, opacity: 0.15, spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Energy Mix",
    subtitle: "Solar, wind, and grid power consumption through the seasons",
    style: "Toast" as const,
    chart: <EnergyConsumptionToastArea />,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import ToastAreaChart from "./charts/toast-area-chart";

const chart = ToastAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Solar (MWh)", values: [120, 145, 210, 310, 420, 480, 510, 470, 350, 230, 150, 110] },
      { legend: "Wind (MWh)", values: [380, 350, 310, 280, 220, 180, 160, 170, 240, 300, 360, 390] },
      { legend: "Grid (MWh)", values: [500, 480, 440, 380, 320, 290, 280, 300, 370, 430, 470, 510] },
    ],
  },
  config: {
    colors: ["#eab308", "#22c55e", "#64748b"],
    area: { strokeWidth: 2, opacity: 0.35, spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "SaaS vs On-Prem Revenue",
    subtitle: "Quarterly revenue shift from on-premise to cloud subscriptions",
    style: "AG" as const,
    chart: <QuarterlyRevenueAgArea />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import AreaChart from "./charts/area-chart";

const chart = AreaChart({
  data: {
    labels: ["Q1 '22", "Q2 '22", "Q3 '22", "Q4 '22", "Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23"],
    datasets: [
      { legend: "SaaS ($M)", values: [8.5, 9.2, 10.1, 11.5, 13.0, 14.8, 16.2, 18.5] },
      { legend: "On-Prem ($M)", values: [12.0, 11.5, 11.0, 10.2, 9.5, 8.8, 8.0, 7.2] },
    ],
  },
  config: {
    colors: { fills: ["#0d9488", "#d97706"], strokes: ["#0d9488", "#d97706"] },
    area: { strokeWidth: 2.5, opacity: 0.35 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Seasonal Patterns",
    subtitle: "Spline areas highlighting cyclical trends",
    style: "Toast" as const,
    chart: <SplineToastAreaChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastAreaChart from "./charts/toast-area-chart";

const chart = ToastAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { legend: "Online Sales", values: [400, 450, 420, 480, 520, 510] },
      { legend: "In-Store Sales", values: [200, 220, 210, 230, 250, 240] },
    ],
  },
  config: {
    colors: ["#8b5cf6", "#06b6d4"],
    area: { strokeWidth: 2, opacity: 0.2, spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Multi-Series Comparison",
    subtitle: "Three economic indicators with angular precision",
    style: "AG" as const,
    chart: <DefaultAgAreaChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import AreaChart from "./charts/area-chart";

const chart = AreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Series A", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
      { legend: "Series B", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
      { legend: "Series C", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.70, 8.99, 8.97, 10.76] },
    ],
  },
  config: { area: { strokeWidth: 2, opacity: 0.3 } },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
];

export const pages: ChartModule = [
  {
    slug: ["area-chart"],
    title: "Area Chart",
    description:
      "Line charts with weight. Fill the area under the curve to emphasize volume, show composition, or highlight cumulative trends.",
    pageType: "overview",
    quickStartCode: basicCode,
    showcaseExamples,
    styles: [
      toastSummary("area-chart", <DefaultToastAreaChart />),
      agSummary("area-chart", <DefaultAgAreaChart />),
    ],
    hasAdvanced: true,
  },
  toastStyle,
  agStyle,
  advancedPage,
];
