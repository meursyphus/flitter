import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  BasicPieChart,
  DonutPieChart,
  MarketSharePieChart,
  ExpenseBreakdownPieChart,
  EnergyMixPie,
  TrafficSourcePie,
  ProgrammingLanguagePie,
  TimeAllocationPie,
  RevenueByRegionPie,
  DevicePie,
} from "./toast/examples";
import {
  BasicAgPieChart,
  DonutAgPieChart,
  MarketShareAgPieChart,
  ExpenseBreakdownAgPieChart,
  EnergyMixAgPie,
} from "./ag/examples";
import { advancedPage } from "./advanced";

const showcaseExamples: ShowcaseExample[] = [
  // Featured hero — AG
  {
    title: "Browser Market Share",
    subtitle: "Global browser usage distribution across 5 platforms",
    style: "AG" as const,
    chart: <BasicAgPieChart />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import PieChart from "./charts/pie-chart";

const chart = PieChart({
  data: {
    datasets: [
      { name: "Chrome", value: 65 },
      { name: "Safari", value: 18 },
      { name: "Firefox", value: 8 },
      { name: "Edge", value: 5 },
      { name: "Other", value: 4 },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Toast
  {
    title: "Budget Allocation Donut",
    subtitle: "Department spend breakdown with inner cutout",
    style: "Toast" as const,
    chart: <DonutPieChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastPieChart from "./charts/toast-pie-chart";

const chart = ToastPieChart({
  data: {
    datasets: [
      { name: "Engineering", value: 45 },
      { name: "Marketing", value: 25 },
      { name: "Sales", value: 15 },
      { name: "Operations", value: 10 },
      { name: "HR", value: 5 },
    ],
  },
  config: {
    colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"],
    pie: { innerRadiusRatio: 0.5 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // AG
  {
    title: "Smartphone Market Share",
    subtitle: "Global smartphone vendor share with 6 segments",
    style: "AG" as const,
    chart: <MarketShareAgPieChart />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import PieChart from "./charts/pie-chart";

const chart = PieChart({
  data: {
    datasets: [
      { name: "Apple", value: 28 },
      { name: "Samsung", value: 22 },
      { name: "Xiaomi", value: 13 },
      { name: "Oppo", value: 9 },
      { name: "Vivo", value: 8 },
      { name: "Others", value: 20 },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Toast
  {
    title: "Monthly Expense Breakdown",
    subtitle: "Household budget across 8 categories as a donut chart",
    style: "Toast" as const,
    chart: <ExpenseBreakdownPieChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastPieChart from "./charts/toast-pie-chart";

const chart = ToastPieChart({
  data: {
    datasets: [
      { name: "Housing", value: 1800 },
      { name: "Food", value: 650 },
      { name: "Transport", value: 420 },
      { name: "Utilities", value: 280 },
      { name: "Healthcare", value: 350 },
      { name: "Entertainment", value: 200 },
      { name: "Education", value: 300 },
      { name: "Savings", value: 500 },
    ],
  },
  config: {
    colors: ["#0d9488", "#d97706", "#6366f1", "#ec4899", "#06b6d4", "#f43f5e", "#84cc16", "#a855f7"],
    pie: { innerRadiusRatio: 0.4, strokeWidth: 3 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // AG
  {
    title: "Global Energy Mix",
    subtitle: "Power generation share by fuel source across 6 types",
    style: "AG" as const,
    chart: <EnergyMixAgPie />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import PieChart from "./charts/pie-chart";

const chart = PieChart({
  data: {
    datasets: [
      { name: "Coal", value: 27 },
      { name: "Natural Gas", value: 24 },
      { name: "Nuclear", value: 10 },
      { name: "Solar", value: 15 },
      { name: "Wind", value: 13 },
      { name: "Hydro", value: 11 },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Toast
  {
    title: "Website Traffic Sources",
    subtitle: "Visitor acquisition channels as a donut chart",
    style: "Toast" as const,
    chart: <TrafficSourcePie />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastPieChart from "./charts/toast-pie-chart";

const chart = ToastPieChart({
  data: {
    datasets: [
      { name: "Organic", value: 38 },
      { name: "Direct", value: 22 },
      { name: "Social", value: 18 },
      { name: "Referral", value: 14 },
      { name: "Email", value: 8 },
    ],
  },
  config: {
    colors: ["#3b82f6", "#10b981", "#f97316", "#ec4899", "#6366f1"],
    pie: { innerRadiusRatio: 0.55 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // AG
  {
    title: "Expense Breakdown (AG)",
    subtitle: "Household budget donut in AG style",
    style: "AG" as const,
    chart: <ExpenseBreakdownAgPieChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import PieChart from "./charts/pie-chart";

const chart = PieChart({
  data: {
    datasets: [
      { name: "Housing", value: 1800 },
      { name: "Food", value: 650 },
      { name: "Transport", value: 420 },
      { name: "Utilities", value: 280 },
      { name: "Healthcare", value: 350 },
      { name: "Entertainment", value: 200 },
      { name: "Education", value: 300 },
      { name: "Savings", value: 500 },
    ],
  },
  config: { pie: { innerRadiusRatio: 0.4 } },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Toast
  {
    title: "Programming Language Popularity",
    subtitle: "Developer survey results across 6 languages",
    style: "Toast" as const,
    chart: <ProgrammingLanguagePie />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastPieChart from "./charts/toast-pie-chart";

const chart = ToastPieChart({
  data: {
    datasets: [
      { name: "Python", value: 28 },
      { name: "JavaScript", value: 22 },
      { name: "TypeScript", value: 15 },
      { name: "Java", value: 14 },
      { name: "Go", value: 11 },
      { name: "Rust", value: 10 },
    ],
  },
  config: {
    colors: ["#3572A5", "#f1e05a", "#3178c6", "#b07219", "#00ADD8", "#dea584"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Toast
  {
    title: "Developer Time Allocation",
    subtitle: "How engineers spend their workday as a donut chart",
    style: "Toast" as const,
    chart: <TimeAllocationPie />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastPieChart from "./charts/toast-pie-chart";

const chart = ToastPieChart({
  data: {
    datasets: [
      { name: "Meetings", value: 25 },
      { name: "Coding", value: 35 },
      { name: "Code Review", value: 15 },
      { name: "Planning", value: 15 },
      { name: "Break", value: 10 },
    ],
  },
  config: {
    colors: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
    pie: { innerRadiusRatio: 0.45, strokeWidth: 3, strokeColor: "#f5f5f5" },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // AG
  {
    title: "Revenue by Region",
    subtitle: "Quarterly revenue split across 4 global regions",
    style: "AG" as const,
    chart: <DonutAgPieChart />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import PieChart from "./charts/pie-chart";

const chart = PieChart({
  data: {
    datasets: [
      { name: "Americas", value: 42 },
      { name: "EMEA", value: 31 },
      { name: "APAC", value: 22 },
      { name: "Other", value: 5 },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
];

export const pages: ChartModule = [
  {
    slug: ["pie-chart"],
    title: "Pie Chart",
    description:
      "Show parts of a whole. Market share, budget allocation, survey distribution — when the total matters as much as the pieces.",
    pageType: "overview",
    hasAdvanced: true,
    showcaseExamples,
    styles: [
      toastSummary("pie-chart", <BasicPieChart />),
      agSummary("pie-chart", <BasicAgPieChart />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
