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
  GrowthAnalyticsToastArea,
  CashFlowToastArea,
} from "./toast/examples";
import {
  DefaultAgAreaChart,
  SplineAgAreaChart,
  CloudUsageAgArea,
  AppPerformanceAgArea,
  QuarterlyRevenueAgArea,
  DarkMonitoringAgArea,
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
    title: "Cash Flow with Negative Dips",
    subtitle: "Operating and net P&L crossing zero to show positive and negative regions",
    style: "Toast" as const,
    chart: <CashFlowToastArea />,
    featured: true,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import ToastAreaChart from "./charts/toast-area-chart";

const chart = ToastAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      { legend: "Operating", values: [120, -45, 80, -30, 150, -60, 95, 200] },
      { legend: "Net P&L", values: [60, -90, 25, -55, 70, -110, 40, 130] },
    ],
  },
  config: {
    colors: ["#10b981", "#ef4444"],
    area: { strokeWidth: 2, opacity: 0.3 },
  },
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
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    datasets: [
      { legend: "Inbound (Gbps)", values: [2.1, 0.8, 1.8, 6.2, 8.1, 5.2] },
      { legend: "Outbound (Gbps)", values: [1.8, 0.5, 1.5, 5.5, 7.2, 4.5] },
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
    subtitle: "Compute, storage, and network spend across the year",
    style: "AG" as const,
    chart: <CloudUsageAgArea />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import AreaChart from "./charts/area-chart";

const chart = AreaChart({
  data: {
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    datasets: [
      { legend: "Compute ($K)", values: [12.5, 14.8, 18.5, 23.4, 24.2, 19.5] },
      { legend: "Storage ($K)", values: [5.2, 5.9, 7.0, 8.2, 9.2, 10.0] },
      { legend: "Network ($K)", values: [3.1, 3.8, 4.9, 6.5, 6.8, 5.0] },
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
    title: "Growth Analytics with Right Legend",
    subtitle: "MRR, ARR, and NRR growth metrics with right-aligned legend",
    style: "Toast" as const,
    chart: <GrowthAnalyticsToastArea />,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import ToastAreaChart from "./charts/toast-area-chart";

const chart = ToastAreaChart({
  data: {
    labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"],
    datasets: [
      { legend: "MRR ($K)", values: [18, 24, 31, 38, 47, 55, 64, 76] },
      { legend: "ARR ($K)", values: [210, 280, 365, 450, 560, 650, 760, 900] },
      { legend: "NRR (%)", values: [105, 108, 112, 115, 118, 121, 124, 128] },
    ],
  },
  config: {
    colors: ["#0ea5e9", "#8b5cf6", "#f59e0b"],
    legend: { position: "right" },
    title: { text: "Growth Metrics", visible: true },
    area: { strokeWidth: 2, opacity: 0.25 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "User Engagement Metrics",
    subtitle: "DAU, WAU, and MAU growth over the year",
    style: "Toast" as const,
    chart: <UserEngagementToastArea />,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import ToastAreaChart from "./charts/toast-area-chart";

const chart = ToastAreaChart({
  data: {
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    datasets: [
      { legend: "DAU (K)", values: [12, 15, 22, 28, 27, 35] },
      { legend: "WAU (K)", values: [45, 55, 70, 85, 82, 102] },
      { legend: "MAU (K)", values: [120, 140, 175, 210, 215, 260] },
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
    title: "Dark Monitoring Panel",
    subtitle: "Network traffic and errors on a dark ops dashboard theme",
    style: "AG" as const,
    chart: <DarkMonitoringAgArea />,
    featured: true,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import AreaChart from "./charts/area-chart";

const chart = AreaChart({
  data: {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    datasets: [
      { legend: "Inbound (Gbps)", values: [1.2, 0.4, 3.8, 6.5, 5.1, 2.8] },
      { legend: "Outbound (Gbps)", values: [0.9, 0.3, 2.5, 4.8, 3.9, 2.1] },
      { legend: "Errors (K)", values: [0.1, 0.05, 0.3, 0.8, 0.6, 0.2] },
    ],
  },
  config: {
    colors: { fills: ["#22d3ee", "#a78bfa", "#f87171"], strokes: ["#22d3ee", "#a78bfa", "#f87171"] },
    background: "#111827",
    grid: { dash: [4, 4], color: "rgba(255,255,255,0.1)" },
    axis: { color: "rgba(255,255,255,0.3)", label: { color: "rgba(255,255,255,0.6)" } },
    legend: { color: "rgba(255,255,255,0.7)" },
    area: { strokeWidth: 1.5, opacity: 0.2, spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "App Performance Monitor",
    subtitle: "CPU and memory utilization over 24 hours with spline smoothing",
    style: "AG" as const,
    chart: <AppPerformanceAgArea />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import AreaChart from "./charts/area-chart";

const chart = AreaChart({
  data: {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    datasets: [
      { legend: "CPU (%)", values: [15, 10, 68, 80, 65, 28] },
      { legend: "Memory (%)", values: [42, 38, 65, 75, 68, 48] },
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
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    datasets: [
      { legend: "Solar (MWh)", values: [120, 210, 420, 510, 350, 150] },
      { legend: "Wind (MWh)", values: [380, 310, 220, 160, 240, 360] },
      { legend: "Grid (MWh)", values: [500, 440, 320, 280, 370, 470] },
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
