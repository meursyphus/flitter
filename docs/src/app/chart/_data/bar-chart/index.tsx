import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  MonthlyRevenueToast,
  SurveyResultsToast,
  BudgetVsActualToast,
  ProfitLossToast,
  PopulationByAgeToast,
  WeeklySalesTrackerToast,
  TopPerformersToast,
  SalesKpiDashboardToast,
  ConditionalPLToast,
} from "./toast/examples";
import {
  QuarterlyEarningsAg,
  ProductComparisonAg,
  YearOverYearAg,
  TopCountriesAg,
  CustomerSegmentsAg,
  NegativePLAg,
  ExecutiveRevenueAg,
} from "./ag/examples";
import { advancedPage } from "./advanced";

const showcaseExamples: ShowcaseExample[] = [
  // Featured hero
  {
    title: "Monthly Revenue",
    subtitle: "Regional breakdown across 3 markets",
    style: "Toast",
    chart: <MonthlyRevenueToast />,
    featured: true,
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
  // Financial
  {
    title: "Quarterly Earnings",
    subtitle: "Revenue and EBITDA by quarter",
    style: "AG",
    chart: <QuarterlyEarningsAg />,
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
    title: "Budget vs Actual",
    subtitle: "Quarterly spend tracking against plan",
    style: "Toast",
    chart: <BudgetVsActualToast />,
    code: `import Widget from "@flitterjs/react";
import ToastBarChart from "./charts/toast-bar-chart";

const chart = ToastBarChart({
  direction: "vertical",
  data: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      { legend: "Budget", values: [120, 135, 140, 150] },
      { legend: "Actual", values: [115, 142, 131, 158] },
    ],
  },
  config: { colors: ["#0d9488", "#d4d4d4"] },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Profit & Loss",
    subtitle: "Net income and operating cash flow with negatives",
    style: "Toast",
    chart: <ProfitLossToast />,
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
    title: "Product Comparison",
    subtitle: "Competitive benchmarking across 5 metrics",
    style: "AG",
    chart: <ProductComparisonAg />,
    code: `import Widget from "@flitterjs/react";
import BarChart from "./charts/bar-chart";

const chart = BarChart({
  direction: "vertical",
  data: {
    labels: ["Reliability", "Speed", "Design", "Support", "Price"],
    datasets: [
      { legend: "Product A", values: [88, 76, 92, 65, 70] },
      { legend: "Product B", values: [72, 91, 68, 82, 85] },
      { legend: "Product C", values: [81, 84, 79, 90, 62] },
    ],
  },
  config: {
    colors: { fills: ["#0ea5e9", "#f97316", "#8b5cf6"] },
    bar: { cornerRadius: 3 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Comparison
  {
    title: "Monthly P&L Swings",
    subtitle: "Visualize volatile monthly swings",
    style: "AG",
    chart: <NegativePLAg />,
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
    title: "Year over Year Growth",
    subtitle: "2024 vs 2025 monthly comparison",
    style: "AG",
    chart: <YearOverYearAg />,
    code: `import Widget from "@flitterjs/react";
import BarChart from "./charts/bar-chart";

const chart = BarChart({
  direction: "vertical",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { legend: "2024", values: [340, 380, 420, 395, 450, 470] },
      { legend: "2025", values: [410, 445, 480, 460, 520, 540] },
    ],
  },
  config: {
    colors: { fills: ["#64748b", "#0d9488"] },
    bar: { cornerRadius: 4 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Survey Results",
    subtitle: "User satisfaction scores by category",
    style: "Toast",
    chart: <SurveyResultsToast />,
    height: 380,
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
  // Demographics & Ranking
  {
    title: "Population by Age Group",
    subtitle: "Male vs female demographic distribution",
    style: "Toast",
    chart: <PopulationByAgeToast />,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import ToastBarChart from "./charts/toast-bar-chart";

const chart = ToastBarChart({
  direction: "horizontal",
  data: {
    labels: ["0-14", "15-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    datasets: [
      { legend: "Male (M)", values: [9.8, 8.2, 11.4, 10.6, 9.1, 7.8, 6.5] },
      { legend: "Female (M)", values: [9.3, 7.9, 11.1, 10.9, 9.4, 8.1, 7.2] },
    ],
  },
  config: { colors: ["#3b82f6", "#ec4899"] },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Top 10 Countries by GDP",
    subtitle: "World's largest economies at a glance",
    style: "AG",
    chart: <TopCountriesAg />,
    height: 420,
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
    title: "Top Performers",
    subtitle: "Identify your top contributors instantly",
    style: "Toast",
    chart: <TopPerformersToast />,
    code: `import Widget from "@flitterjs/react";
import ToastBarChart from "./charts/toast-bar-chart";

const chart = ToastBarChart({
  direction: "vertical",
  data: {
    labels: ["Alice", "Bob", "Carol", "Dave", "Eve"],
    datasets: [{ legend: "Sales ($K)", values: [142, 128, 115, 98, 87] }],
  },
  config: { colors: ["#f97316"] },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Minimal
  {
    title: "Weekly Sales Tracker",
    subtitle: "Track daily throughput at a glance",
    style: "Toast",
    chart: <WeeklySalesTrackerToast />,
    code: `import Widget from "@flitterjs/react";
import ToastBarChart from "./charts/toast-bar-chart";

const chart = ToastBarChart({
  direction: "vertical",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ legend: "Units Sold", values: [64, 82, 75, 93, 110, 142, 98] }],
  },
  config: { colors: ["#6366f1"] },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Customer Segments",
    subtitle: "New ARR, expansion, and churn by segment",
    style: "AG",
    chart: <CustomerSegmentsAg />,
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
  // --- New examples ---
  {
    title: "Sales KPI Dashboard",
    subtitle: "Regional sales with currency-formatted axis",
    style: "Toast",
    chart: <SalesKpiDashboardToast />,
    code: `import Widget from "@flitterjs/react";
import ToastBarChart from "./charts/toast-bar-chart";

const chart = ToastBarChart({
  direction: "vertical",
  data: {
    labels: ["West", "East", "South", "North"],
    datasets: [
      { legend: "Closed", values: [82, 67, 54, 71] },
      { legend: "Pipeline", values: [45, 38, 62, 29] },
    ],
  },
  config: {
    colors: ["#0d9488", "#a7f3d0"],
    bar: { cornerRadius: 3 },
    axis: {
      label: {
        format: (name, _index, axis) =>
          axis === "y" ? \`$\${name}K\` : name,
      },
    },
    grid: { color: "rgba(0,0,0,0.04)" },
    padding: { top: 16, right: 24, bottom: 16, left: 24 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Executive Revenue Summary",
    subtitle: "Q4 breakdown with title, subtitle, and right legend",
    style: "AG",
    chart: <ExecutiveRevenueAg />,
    code: `import Widget from "@flitterjs/react";
import BarChart from "./charts/bar-chart";

const chart = BarChart({
  direction: "vertical",
  data: {
    labels: ["Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Product", values: [4.8, 5.2, 6.1] },
      { legend: "Services", values: [2.1, 2.4, 2.9] },
      { legend: "Licensing", values: [1.3, 1.1, 1.5] },
    ],
  },
  config: {
    background: "#fafafa",
    colors: { fills: ["#2563eb", "#7c3aed", "#e879f9"] },
    title: { text: "Q4 Revenue", visible: true },
    subtitle: { text: "Breakdown by stream ($M)", visible: true },
    legend: { position: "right-top" },
    bar: { cornerRadius: 4 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Conditional P&L",
    subtitle: "Custom bar colors based on positive/negative values",
    style: "Toast",
    chart: <ConditionalPLToast />,
    code: `import Widget from "@flitterjs/react";
import ToastBarChart from "./charts/toast-bar-chart";
import { Container, BoxDecoration, EdgeInsets } from "flitter-core";

const chart = ToastBarChart({
  direction: "vertical",
  data: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      { legend: "Net Income ($K)", values: [120, -45, 85, -60] },
    ],
  },
  config: {
    colors: ["#10b981"],
    bar: { cornerRadius: 3 },
  },
  custom: {
    bar: ({ value }) =>
      Container({
        margin: EdgeInsets.symmetric({ horizontal: 1 }),
        decoration: new BoxDecoration({
          color: value >= 0 ? "#10b981" : "#ef4444",
        }),
      }),
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
];

export const pages: ChartModule = [
  {
    slug: ["bar-chart"],
    title: "Bar Chart",
    description:
      "Compare categories side by side. Revenue by region, survey responses, budget vs actual — if you're comparing discrete groups, this is your chart.",
    pageType: "overview",
    styles: [
      toastSummary("bar-chart", <MonthlyRevenueToast />),
      agSummary("bar-chart", <QuarterlyEarningsAg />),
    ],
    showcaseExamples,
    hasAdvanced: true,
  },
  toastStyle,
  agStyle,
  advancedPage,
];
