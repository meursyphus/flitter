import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  DefaultToastStackedAreaChart,
  TrafficSourceStackedArea,
  RevenueStreamStackedArea,
  EnergyMixToastStackedArea,
  AppUsageToastStackedArea,
  SupportTicketsToastStackedArea,
} from "./toast/examples";
import {
  DefaultAgStackedAreaChart,
  ResourceAllocationStackedArea,
  CloudCostAgStackedArea,
  TeamVelocityAgStackedArea,
  MarketShareAgStackedArea,
} from "./ag/examples";
import { advancedPage } from "./advanced";

const basicCode = `import StackedAreaChart from "./charts/stacked-area-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = StackedAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      { legend: "Organic", values: [400, 450, 420, 480] },
      { legend: "Direct", values: [200, 220, 210, 230] },
    ],
  },
});

// Render with React
<Widget widget={chart} width={600} height={400} />`;

const showcaseExamples: ShowcaseExample[] = [
  {
    title: "Traffic Source Breakdown",
    subtitle: "Organic, direct, social, and referral traffic over 12 months",
    style: "Toast" as const,
    chart: <DefaultToastStackedAreaChart />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastStackedAreaChart from "./charts/toast-stacked-area-chart";

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
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Website Traffic by Source",
    subtitle: "Search, social, email, and direct visits trending upward",
    style: "Toast" as const,
    chart: <TrafficSourceStackedArea />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastStackedAreaChart from "./charts/toast-stacked-area-chart";

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
  config: {
    colors: ["#3b82f6", "#f97316", "#10b981", "#8b5cf6"],
    area: { opacity: 0.5 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Revenue by Product Line",
    subtitle: "Quarterly revenue streams from subscriptions, licensing, services, and hardware",
    style: "Toast" as const,
    chart: <RevenueStreamStackedArea />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastStackedAreaChart from "./charts/toast-stacked-area-chart";

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
  config: {
    colors: ["#0d9488", "#d97706", "#ec4899", "#64748b"],
    area: { opacity: 0.4, strokeWidth: 1.5 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Revenue Stream Composition",
    subtitle: "AG style showing how revenue sources evolve over time",
    style: "AG" as const,
    chart: <DefaultAgStackedAreaChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import StackedAreaChart from "./charts/stacked-area-chart";

const chart = StackedAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Organic", values: [400, 450, 420, 480, 520, 510, 550, 530, 560, 600, 620, 650] },
      { legend: "Direct", values: [200, 220, 210, 230, 250, 240, 260, 255, 270, 290, 300, 310] },
      { legend: "Social", values: [100, 120, 130, 140, 160, 155, 170, 165, 180, 200, 210, 220] },
      { legend: "Referral", values: [50, 60, 55, 65, 70, 75, 80, 78, 85, 90, 95, 100] },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Resource Allocation per Sprint",
    subtitle: "AG style team capacity distribution across development, QA, design, and DevOps",
    style: "AG" as const,
    chart: <ResourceAllocationStackedArea />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import StackedAreaChart from "./charts/stacked-area-chart";

const chart = StackedAreaChart({
  data: {
    labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6", "Sprint 7", "Sprint 8"],
    datasets: [
      { legend: "Development", values: [45, 50, 48, 52, 55, 50, 53, 56] },
      { legend: "QA", values: [15, 18, 20, 22, 20, 25, 22, 24] },
      { legend: "Design", values: [12, 10, 8, 10, 12, 8, 10, 8] },
      { legend: "DevOps", values: [8, 10, 12, 10, 8, 12, 10, 12] },
    ],
  },
  config: {
    colors: { fills: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"], strokes: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"] },
    area: { opacity: 0.5 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Energy Generation Mix",
    subtitle: "Monthly power output from solar, wind, gas, and nuclear sources",
    style: "Toast" as const,
    chart: <EnergyMixToastStackedArea />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastStackedAreaChart from "./charts/toast-stacked-area-chart";

const chart = ToastStackedAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Solar", values: [120, 140, 180, 240, 310, 380, 400, 370, 290, 210, 150, 110] },
      { legend: "Wind", values: [280, 260, 240, 220, 200, 180, 170, 190, 230, 270, 290, 300] },
      { legend: "Gas", values: [350, 340, 310, 280, 250, 230, 220, 225, 260, 300, 330, 360] },
      { legend: "Nuclear", values: [400, 400, 395, 405, 400, 410, 405, 400, 398, 402, 400, 405] },
    ],
  },
  config: {
    colors: ["#eab308", "#22c55e", "#64748b", "#a855f7"],
    area: { opacity: 0.55, spline: true },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "App Sessions by Platform",
    subtitle: "iOS, Android, and web session trends over 12 months",
    style: "Toast" as const,
    chart: <AppUsageToastStackedArea />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastStackedAreaChart from "./charts/toast-stacked-area-chart";

const chart = ToastStackedAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "iOS", values: [4500, 4700, 4900, 5200, 5500, 5800, 6100, 6000, 5900, 6200, 6500, 6800] },
      { legend: "Android", values: [5200, 5400, 5700, 6000, 6400, 6700, 7000, 6900, 6800, 7100, 7400, 7800] },
      { legend: "Web", values: [2800, 2900, 3000, 3100, 3200, 3100, 2900, 2800, 3100, 3300, 3500, 3600] },
    ],
  },
  config: {
    colors: ["#3b82f6", "#10b981", "#f59e0b"],
    area: { opacity: 0.45, strokeWidth: 2.5 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Support Ticket Trends",
    subtitle: "Bug reports, feature requests, questions, and billing tickets over time",
    style: "Toast" as const,
    chart: <SupportTicketsToastStackedArea />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastStackedAreaChart from "./charts/toast-stacked-area-chart";

const chart = ToastStackedAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Bug Reports", values: [85, 78, 92, 88, 75, 70, 65, 72, 80, 68, 62, 58] },
      { legend: "Feature Requests", values: [45, 52, 48, 55, 60, 65, 70, 68, 72, 78, 82, 88] },
      { legend: "Questions", values: [120, 115, 108, 100, 95, 90, 88, 85, 82, 78, 75, 70] },
      { legend: "Billing", values: [30, 28, 32, 35, 30, 28, 25, 27, 30, 32, 28, 25] },
    ],
  },
  config: {
    colors: ["#ef4444", "#6366f1", "#06b6d4", "#f59e0b"],
    area: { opacity: 0.35 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Cloud Infrastructure Costs",
    subtitle: "Monthly spend across compute, storage, network, and database services",
    style: "AG" as const,
    chart: <CloudCostAgStackedArea />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import StackedAreaChart from "./charts/stacked-area-chart";

const chart = StackedAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Compute", values: [4200, 4400, 4600, 4800, 5100, 5400, 5700, 5500, 5800, 6000, 6300, 6600] },
      { legend: "Storage", values: [1800, 1900, 2000, 2100, 2200, 2350, 2500, 2600, 2750, 2900, 3050, 3200] },
      { legend: "Network", values: [900, 950, 1000, 1050, 1100, 1200, 1300, 1250, 1350, 1400, 1500, 1600] },
      { legend: "Database", values: [1500, 1550, 1600, 1650, 1700, 1800, 1900, 1950, 2000, 2100, 2200, 2300] },
    ],
  },
  config: {
    colors: { fills: ["#0ea5e9", "#f97316", "#8b5cf6", "#10b981"], strokes: ["#0ea5e9", "#f97316", "#8b5cf6", "#10b981"] },
    area: { opacity: 0.45 },
    grid: { dash: [4, 4] },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Team Velocity by Squad",
    subtitle: "Frontend, backend, and mobile story points across 10 sprints",
    style: "AG" as const,
    chart: <TeamVelocityAgStackedArea />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import StackedAreaChart from "./charts/stacked-area-chart";

const chart = StackedAreaChart({
  data: {
    labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6", "Sprint 7", "Sprint 8", "Sprint 9", "Sprint 10"],
    datasets: [
      { legend: "Frontend", values: [28, 32, 30, 35, 38, 36, 40, 42, 38, 44] },
      { legend: "Backend", values: [35, 38, 40, 42, 45, 43, 48, 46, 50, 52] },
      { legend: "Mobile", values: [18, 20, 22, 24, 26, 25, 28, 30, 32, 34] },
    ],
  },
  config: {
    colors: { fills: ["#6366f1", "#ec4899", "#f59e0b"], strokes: ["#6366f1", "#ec4899", "#f59e0b"] },
    area: { opacity: 0.55, spline: true, strokeWidth: 1.5 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Browser Market Share",
    subtitle: "Chrome, Safari, Firefox, and Edge share evolving over 12 months",
    style: "AG" as const,
    chart: <MarketShareAgStackedArea />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import StackedAreaChart from "./charts/stacked-area-chart";

const chart = StackedAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Chrome", values: [64, 63.8, 63.5, 63.2, 63, 62.8, 62.5, 62.3, 62, 61.8, 61.5, 61.2] },
      { legend: "Safari", values: [19, 19.2, 19.5, 19.8, 20, 20.3, 20.5, 20.8, 21, 21.3, 21.5, 21.8] },
      { legend: "Firefox", values: [8, 7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.3, 7.2, 7.1, 7, 6.9] },
      { legend: "Edge", values: [5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6, 6.1] },
    ],
  },
  config: {
    colors: { fills: ["#ef4444", "#3b82f6", "#f59e0b", "#10b981"], strokes: ["#ef4444", "#3b82f6", "#f59e0b", "#10b981"] },
    area: { opacity: 0.6 },
    background: "#fafafa",
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
];

export const pages: ChartModule = [
  {
    slug: ["stacked-area-chart"],
    title: "Stacked Area Chart",
    description:
      "Track how composition changes over time. Traffic sources, revenue streams, resource allocation — the area fills tell the story.",
    pageType: "overview",
    quickStartCode: basicCode,
    hasAdvanced: true,
    showcaseExamples,
    styles: [
      toastSummary("stacked-area-chart", <DefaultToastStackedAreaChart />),
      agSummary("stacked-area-chart", <DefaultAgStackedAreaChart />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
