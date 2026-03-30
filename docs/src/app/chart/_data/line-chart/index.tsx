import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  DefaultToastLineChart,
  SplineToastLineChart,
  MultiMetricToastLineChart,
  RevenueExpensesToastLine,
  ServerResponseToastLine,
  FitnessTrackerToastLine,
  TemperatureTrendToastLine,
} from "./toast/examples";
import {
  DefaultAgLineChart,
  SplineAgLineChart,
  StockPriceAgLineChart,
  WebAnalyticsAgLine,
  MonthlySalesAgLine,
  CryptoTrendAgLine,
} from "./ag/examples";
import { advancedPage } from "./advanced";

const basicCode = `import LineChart from "./charts/line-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = LineChart({
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
    title: "Economic Indicators",
    subtitle: "Housing, unemployment, and CPI tracked over 12 months",
    style: "Toast" as const,
    chart: <DefaultToastLineChart />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastLineChart from "./charts/toast-line-chart";

const chart = ToastLineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Housing starts (MoM %)", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
      { legend: "Unemployment rate", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
      { legend: "CPI MoM", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.70, 8.99, 8.97, 10.76] },
    ],
  },
  config: { line: { strokeWidth: 2 } },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Revenue vs Expenses",
    subtitle: "Monthly revenue and expense tracking over 8 months",
    style: "Toast" as const,
    chart: <RevenueExpensesToastLine />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastLineChart from "./charts/toast-line-chart";

const chart = ToastLineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      { legend: "Revenue ($K)", values: [84, 92, 88, 105, 118, 112, 130, 142] },
      { legend: "Expenses ($K)", values: [62, 68, 71, 74, 80, 78, 85, 90] },
    ],
  },
  config: {
    colors: ["#10b981", "#ef4444"],
    line: { strokeWidth: 3 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Smooth Trend Analysis",
    subtitle: "Spline interpolation for polished data visualization",
    style: "AG" as const,
    chart: <SplineAgLineChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import LineChart from "./charts/line-chart";

const chart = LineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Housing starts", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
      { legend: "Unemployment", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
    ],
  },
  config: {
    colors: { fills: ["#7c3aed", "#06b6d4"], strokes: ["#7c3aed", "#06b6d4"] },
    grid: { dash: [4, 4] },
    line: { strokeWidth: 2, spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Server Response Times",
    subtitle: "API latency percentiles (p50, p95, p99) over 24 hours with spline curves",
    style: "Toast" as const,
    chart: <ServerResponseToastLine />,
    featured: true,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import ToastLineChart from "./charts/toast-line-chart";

const chart = ToastLineChart({
  data: {
    labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
    datasets: [
      { legend: "p50 (ms)", values: [45, 42, 38, 40, 68, 120, 135, 142, 128, 95, 72, 50] },
      { legend: "p95 (ms)", values: [120, 110, 95, 105, 210, 380, 420, 445, 390, 280, 195, 130] },
      { legend: "p99 (ms)", values: [280, 250, 210, 230, 480, 720, 810, 850, 740, 520, 380, 290] },
    ],
  },
  config: {
    colors: ["#3b82f6", "#f97316", "#dc2626"],
    line: { strokeWidth: 1.5, spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Web Analytics Dashboard",
    subtitle: "Pageviews, sessions, and bounce rate over a year",
    style: "AG" as const,
    chart: <WebAnalyticsAgLine />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import LineChart from "./charts/line-chart";

const chart = LineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Pageviews (K)", values: [320, 345, 380, 410, 395, 430, 465, 490, 475, 510, 540, 580] },
      { legend: "Sessions (K)", values: [180, 195, 215, 230, 220, 245, 260, 275, 265, 290, 305, 325] },
      { legend: "Bounce Rate (%)", values: [42, 40, 38, 36, 37, 34, 32, 30, 31, 29, 28, 26] },
    ],
  },
  config: {
    colors: { fills: ["#0ea5e9", "#f97316", "#a855f7"], strokes: ["#0ea5e9", "#f97316", "#a855f7"] },
    legend: { position: "right-top" },
    line: { strokeWidth: 2 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Fitness Tracker",
    subtitle: "Steps, calories, and distance across a week",
    style: "Toast" as const,
    chart: <FitnessTrackerToastLine />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastLineChart from "./charts/toast-line-chart";

const chart = ToastLineChart({
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      { legend: "Steps (K)", values: [8.2, 10.5, 7.8, 12.1, 9.4, 15.3, 6.2] },
      { legend: "Calories (100s)", values: [22, 28, 20, 32, 25, 38, 18] },
      { legend: "Distance (km)", values: [5.8, 7.4, 5.5, 8.5, 6.6, 10.8, 4.4] },
    ],
  },
  config: {
    colors: ["#8b5cf6", "#f59e0b", "#06b6d4"],
    line: { strokeWidth: 2 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Monthly Product Sales",
    subtitle: "Three product lines with smooth spline curves across seasons",
    style: "AG" as const,
    chart: <MonthlySalesAgLine />,
    featured: true,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import LineChart from "./charts/line-chart";

const chart = LineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Electronics", values: [95, 88, 102, 110, 98, 115, 128, 135, 120, 140, 165, 190] },
      { legend: "Clothing", values: [65, 58, 72, 80, 85, 90, 78, 70, 88, 95, 110, 130] },
      { legend: "Home & Garden", values: [40, 35, 48, 62, 75, 82, 88, 85, 70, 55, 42, 38] },
    ],
  },
  config: {
    colors: { fills: ["#059669", "#d97706", "#e11d48"], strokes: ["#059669", "#d97706", "#e11d48"] },
    line: { strokeWidth: 2.5, spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Temperature Trends",
    subtitle: "Annual temperature curves for Tokyo, London, and New York",
    style: "Toast" as const,
    chart: <TemperatureTrendToastLine />,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import ToastLineChart from "./charts/toast-line-chart";

const chart = ToastLineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Tokyo", values: [5.2, 5.7, 8.7, 13.9, 18.2, 21.4, 25.0, 26.4, 22.8, 17.5, 12.1, 7.6] },
      { legend: "London", values: [4.9, 5.0, 7.2, 9.9, 13.3, 16.4, 18.7, 18.2, 15.5, 11.8, 7.8, 5.4] },
      { legend: "New York", values: [0.6, 1.8, 5.9, 11.7, 17.1, 22.1, 24.9, 24.2, 20.2, 14.0, 8.4, 3.3] },
    ],
  },
  config: {
    colors: ["#ef4444", "#3b82f6", "#10b981"],
    line: { strokeWidth: 2.5, spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Multi-Metric Dashboard",
    subtitle: "Revenue, users, conversion, and churn tracked together over 12 months",
    style: "Toast" as const,
    chart: <MultiMetricToastLineChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastLineChart from "./charts/toast-line-chart";

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
  config: {
    colors: ["#0d9488", "#f59e0b", "#ef4444", "#8b5cf6"],
    legend: { position: "right-top" },
    line: { strokeWidth: 2 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Crypto Market Trends",
    subtitle: "BTC, ETH, and SOL price movements through a bear market",
    style: "AG" as const,
    chart: <CryptoTrendAgLine />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import LineChart from "./charts/line-chart";

const chart = LineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "BTC ($K)", values: [42.5, 44.8, 40.2, 38.5, 36.1, 31.2, 29.8, 24.5, 19.8, 20.5, 16.8, 16.5] },
      { legend: "ETH ($K)", values: [3.2, 3.0, 2.8, 2.9, 2.1, 1.8, 1.6, 1.5, 1.3, 1.4, 1.2, 1.2] },
      { legend: "SOL ($)", values: [170, 105, 95, 100, 50, 38, 35, 33, 32, 30, 14, 12] },
    ],
  },
  config: {
    colors: { fills: ["#f7931a", "#627eea", "#9945ff"], strokes: ["#f7931a", "#627eea", "#9945ff"] },
    background: "#111827",
    title: { color: "#e5e7eb" },
    axis: { label: { color: "#9ca3af" }, color: "#374151" },
    grid: { color: "#1f2937" },
    legend: { color: "#d1d5db" },
    line: { strokeWidth: 2 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Stock Price Trends",
    subtitle: "AAPL, GOOGL, and MSFT price movement over a year",
    style: "AG" as const,
    chart: <StockPriceAgLineChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import LineChart from "./charts/line-chart";

const chart = LineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "AAPL", values: [185, 190, 178, 195, 188, 210, 225, 218, 230, 222, 240, 248] },
      { legend: "GOOGL", values: [140, 145, 138, 150, 155, 162, 158, 170, 175, 168, 180, 188] },
      { legend: "MSFT", values: [375, 382, 370, 390, 398, 410, 420, 415, 430, 425, 440, 455] },
    ],
  },
  config: {
    colors: { fills: ["#2563eb", "#dc2626", "#059669"], strokes: ["#2563eb", "#dc2626", "#059669"] },
    background: "#fafafa",
    grid: { dash: [2, 2] },
    line: { strokeWidth: 2 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Spline Curves",
    subtitle: "Smooth curves revealing seasonal patterns",
    style: "Toast" as const,
    chart: <SplineToastLineChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastLineChart from "./charts/toast-line-chart";

const chart = ToastLineChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { legend: "Revenue ($K)", values: [40, 65, 50, 80, 72, 95] },
      { legend: "Expenses ($K)", values: [30, 42, 38, 55, 48, 60] },
    ],
  },
  config: {
    colors: ["#6366f1", "#ec4899"],
    line: { strokeWidth: 2, spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
];

export const pages: ChartModule = [
  {
    slug: ["line-chart"],
    title: "Line Chart",
    description:
      "Show change over time. Revenue trends, user growth, sensor readings — connect the dots and see the story.",
    pageType: "overview",
    hasAdvanced: true,
    quickStartCode: basicCode,
    showcaseExamples,
    styles: [
      toastSummary("line-chart", <DefaultToastLineChart />),
      agSummary("line-chart", <DefaultAgLineChart />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
