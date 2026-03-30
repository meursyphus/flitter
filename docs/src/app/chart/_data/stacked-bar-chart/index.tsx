import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  VerticalToastStackedBarChart,
  HorizontalToastStackedBarChart,
  NegativeVerticalToastStackedBarChart,
  MarketingChannelToastStacked,
  BudgetAllocationToastStacked,
  EnergySourceToastStacked,
  EmployeeDistToastStacked,
} from "./toast/examples";
import {
  VerticalAgStackedBarChart,
  HorizontalAgStackedBarChart,
  NegativeVerticalAgStackedBarChart,
  RevenueByProductAgStacked,
  SurveyResponsesAgStacked,
  ProjectTimelineAgStacked,
} from "./ag/examples";
import { advancedPage } from "./advanced";

const basicCode = `import StackedBarChart from "./charts/stacked-bar-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = StackedBarChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      { legend: "Product A", values: [40, 65, 50, 80] },
      { legend: "Product B", values: [30, 45, 35, 60] },
    ],
  },
});

// Render with React
<Widget widget={chart} width={600} height={400} />`;

const showcaseExamples: ShowcaseExample[] = [
  {
    title: "Regional Revenue Breakdown",
    subtitle: "Monthly revenue stacked by North America, Europe, and Asia Pacific",
    style: "Toast" as const,
    chart: <VerticalToastStackedBarChart />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastStackedBarChart from "./charts/toast-stacked-bar-chart";

const chart = ToastStackedBarChart({
  direction: "vertical",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
      { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
      { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Department Headcount",
    subtitle: "Horizontal stacked bars for category comparison",
    style: "AG" as const,
    chart: <HorizontalAgStackedBarChart />,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import StackedBarChart from "./charts/stacked-bar-chart";

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
  config: {
    colors: { fills: ["#6366f1", "#ec4899", "#10b981"], strokes: ["#6366f1", "#ec4899", "#10b981"] },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Product P&L Mix",
    subtitle: "Positive and negative values stacked by product line",
    style: "Toast" as const,
    chart: <NegativeVerticalToastStackedBarChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastStackedBarChart from "./charts/toast-stacked-bar-chart";

const chart = ToastStackedBarChart({
  direction: "vertical",
  data: {
    labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25"],
    datasets: [
      { legend: "Product A", values: [-20, 15, -5, 30, -10, 25, 8] },
      { legend: "Product B", values: [10, -12, 22, -8, 18, -15, 30] },
      { legend: "Product C", values: [5, -25, 12, 20, -18, 10, -7] },
    ],
  },
  config: {
    colors: ["#10b981", "#ef4444", "#3b82f6"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Regional Sales Composition",
    subtitle: "AG style vertical stacked bars",
    style: "AG" as const,
    chart: <VerticalAgStackedBarChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import StackedBarChart from "./charts/stacked-bar-chart";

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
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Horizontal Category View",
    subtitle: "Toast style horizontal stacked bars for easy label reading",
    style: "Toast" as const,
    chart: <HorizontalToastStackedBarChart />,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import ToastStackedBarChart from "./charts/toast-stacked-bar-chart";

const chart = ToastStackedBarChart({
  direction: "horizontal",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
      { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
      { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
    ],
  },
  config: {
    colors: ["#6366f1", "#ec4899", "#f59e0b"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Volatile Quarterly Mix",
    subtitle: "AG style with positive and negative stacked values",
    style: "AG" as const,
    chart: <NegativeVerticalAgStackedBarChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import StackedBarChart from "./charts/stacked-bar-chart";

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
  config: {
    colors: { fills: ["#059669", "#dc2626", "#3b82f6"], strokes: ["#059669", "#dc2626", "#3b82f6"] },
    grid: { dash: [4, 4] },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Marketing Channel Conversions",
    subtitle: "SEO, paid ads, social, and email conversions by month",
    style: "Toast" as const,
    chart: <MarketingChannelToastStacked />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastStackedBarChart from "./charts/toast-stacked-bar-chart";

const chart = ToastStackedBarChart({
  direction: "vertical",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { legend: "SEO", values: [320, 380, 410, 450, 520, 580] },
      { legend: "Paid Ads", values: [210, 250, 230, 270, 290, 310] },
      { legend: "Social", values: [140, 160, 180, 200, 220, 250] },
      { legend: "Email", values: [90, 100, 110, 120, 130, 145] },
    ],
  },
  config: {
    colors: ["#0ea5e9", "#8b5cf6", "#f97316", "#10b981"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Budget Allocation by Department",
    subtitle: "Quarterly budget breakdown across Engineering, Marketing, Sales, and Ops",
    style: "Toast" as const,
    chart: <BudgetAllocationToastStacked />,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import ToastStackedBarChart from "./charts/toast-stacked-bar-chart";

const chart = ToastStackedBarChart({
  direction: "horizontal",
  data: {
    labels: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
    datasets: [
      { legend: "Engineering", values: [450, 480, 520, 550] },
      { legend: "Marketing", values: [200, 220, 210, 240] },
      { legend: "Sales", values: [180, 190, 200, 210] },
      { legend: "Operations", values: [120, 130, 125, 140] },
    ],
  },
  config: {
    colors: ["#2563eb", "#dc2626", "#059669", "#d97706"],
    bar: { gap: 2 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Energy Generation by Source",
    subtitle: "Monthly energy output from solar, wind, hydro, and nuclear",
    style: "Toast" as const,
    chart: <EnergySourceToastStacked />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastStackedBarChart from "./charts/toast-stacked-bar-chart";

const chart = ToastStackedBarChart({
  direction: "vertical",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Solar", values: [120, 140, 180, 220, 280, 320, 340, 310, 260, 200, 150, 110] },
      { legend: "Wind", values: [200, 210, 190, 170, 160, 140, 130, 145, 175, 195, 220, 230] },
      { legend: "Hydro", values: [150, 160, 180, 200, 190, 170, 155, 140, 150, 165, 170, 155] },
      { legend: "Nuclear", values: [300, 300, 295, 305, 300, 310, 305, 300, 298, 302, 300, 305] },
    ],
  },
  config: {
    colors: ["#eab308", "#22c55e", "#06b6d4", "#a855f7"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Employee Distribution by Seniority",
    subtitle: "Junior, mid-level, and senior headcount across departments",
    style: "Toast" as const,
    chart: <EmployeeDistToastStacked />,
    featured: true,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import ToastStackedBarChart from "./charts/toast-stacked-bar-chart";

const chart = ToastStackedBarChart({
  direction: "horizontal",
  data: {
    labels: ["Engineering", "Marketing", "Sales", "Support", "Design", "Product"],
    datasets: [
      { legend: "Junior", values: [45, 20, 25, 30, 12, 8] },
      { legend: "Mid-Level", values: [60, 25, 30, 20, 15, 12] },
      { legend: "Senior", values: [35, 15, 20, 10, 8, 10] },
    ],
  },
  config: {
    colors: ["#3b82f6", "#f59e0b", "#ef4444"],
    bar: { gap: 1 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Revenue by Product Line",
    subtitle: "SaaS, mobile, and API revenue growth by quarter",
    style: "AG" as const,
    chart: <RevenueByProductAgStacked />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import StackedBarChart from "./charts/stacked-bar-chart";

const chart = StackedBarChart({
  direction: "vertical",
  data: {
    labels: ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024"],
    datasets: [
      { legend: "SaaS Platform", values: [850, 920, 980, 1050, 1120, 1200] },
      { legend: "Mobile App", values: [320, 380, 420, 460, 510, 560] },
      { legend: "API Services", values: [180, 210, 240, 280, 320, 370] },
    ],
  },
  config: {
    colors: { fills: ["#0d9488", "#d97706", "#7c3aed"], strokes: ["#0d9488", "#d97706", "#7c3aed"] },
    background: "#fafafa",
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Employee Survey Responses",
    subtitle: "Agreement levels across workplace satisfaction categories",
    style: "AG" as const,
    chart: <SurveyResponsesAgStacked />,
    height: 380,
    code: `import Widget from "@flitterjs/react";
import StackedBarChart from "./charts/stacked-bar-chart";

const chart = StackedBarChart({
  direction: "horizontal",
  data: {
    labels: ["Work-Life Balance", "Compensation", "Growth", "Culture", "Leadership"],
    datasets: [
      { legend: "Strongly Agree", values: [45, 28, 38, 52, 35] },
      { legend: "Agree", values: [30, 32, 28, 25, 30] },
      { legend: "Neutral", values: [15, 20, 18, 12, 18] },
      { legend: "Disagree", values: [10, 20, 16, 11, 17] },
    ],
  },
  config: {
    colors: { fills: ["#22c55e", "#86efac", "#fcd34d", "#f87171"], strokes: ["#22c55e", "#86efac", "#fcd34d", "#f87171"] },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Sprint Effort Breakdown",
    subtitle: "Design, development, QA, and deployment hours per sprint",
    style: "AG" as const,
    chart: <ProjectTimelineAgStacked />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import StackedBarChart from "./charts/stacked-bar-chart";

const chart = StackedBarChart({
  direction: "vertical",
  data: {
    labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6"],
    datasets: [
      { legend: "Design", values: [24, 16, 12, 20, 14, 10] },
      { legend: "Development", values: [40, 56, 64, 48, 60, 72] },
      { legend: "QA", values: [8, 16, 20, 24, 18, 22] },
      { legend: "Deploy", values: [4, 8, 6, 8, 10, 8] },
    ],
  },
  config: {
    colors: { fills: ["#8b5cf6", "#3b82f6", "#f59e0b", "#ef4444"], strokes: ["#8b5cf6", "#3b82f6", "#f59e0b", "#ef4444"] },
    grid: { dash: [2, 2] },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
];

export const pages: ChartModule = [
  {
    slug: ["stacked-bar-chart"],
    title: "Stacked Bar Chart",
    description:
      "Show composition within categories. Revenue breakdown by product line, workforce by department — see both the total and the parts.",
    pageType: "overview",
    quickStartCode: basicCode,
    hasAdvanced: true,
    showcaseExamples,
    styles: [
      toastSummary("stacked-bar-chart", <VerticalToastStackedBarChart />),
      agSummary("stacked-bar-chart", <VerticalAgStackedBarChart />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
