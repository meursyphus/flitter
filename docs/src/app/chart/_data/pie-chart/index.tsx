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
  BudgetDonutDashboardPie,
} from "./toast/examples.generated";
import {
  BasicAgPieChart,
  DonutAgPieChart,
  MarketShareAgPieChart,
  ExpenseBreakdownAgPieChart,
  EnergyMixAgPie,
  QuarterlyReportAgPie,
} from "./ag/examples.generated";
import { advancedPage } from "./advanced";

const showcaseExamples: ShowcaseExample[] = [
  // Featured hero — AG
  {
    title: "Browser Market Share",
    subtitle: "Global browser usage distribution across 5 platforms",
    style: "AG" as const,
    chart: <BasicAgPieChart.Component />,
    featured: true,
    height: 360,
    code: BasicAgPieChart.code,
  },
  // Toast
  {
    title: "Budget Allocation Donut",
    subtitle: "Department spend breakdown with inner cutout",
    style: "Toast" as const,
    chart: <DonutPieChart.Component />,
    height: 360,
    code: DonutPieChart.code,
  },
  // AG
  {
    title: "Smartphone Market Share",
    subtitle: "Global smartphone vendor share with 6 segments",
    style: "AG" as const,
    chart: <MarketShareAgPieChart.Component />,
    featured: true,
    height: 360,
    code: MarketShareAgPieChart.code,
  },
  // Toast
  {
    title: "Monthly Expense Breakdown",
    subtitle: "Household budget across 8 categories as a donut chart",
    style: "Toast" as const,
    chart: <ExpenseBreakdownPieChart.Component />,
    height: 360,
    code: ExpenseBreakdownPieChart.code,
  },
  // AG
  {
    title: "Global Energy Mix",
    subtitle: "Power generation share by fuel source across 6 types",
    style: "AG" as const,
    chart: <EnergyMixAgPie.Component />,
    featured: true,
    height: 360,
    code: EnergyMixAgPie.code,
  },
  // Toast
  {
    title: "Website Traffic Sources",
    subtitle: "Visitor acquisition channels as a donut chart",
    style: "Toast" as const,
    chart: <TrafficSourcePie.Component />,
    height: 360,
    code: TrafficSourcePie.code,
  },
  // AG — NEW: Quarterly Report Figure
  {
    title: "Quarterly Report Figure",
    subtitle: "Revenue split with bottom-positioned title for report layouts",
    style: "AG" as const,
    chart: <QuarterlyReportAgPie.Component />,
    featured: true,
    height: 360,
    code: QuarterlyReportAgPie.code,
  },
  // AG
  {
    title: "Expense Breakdown (AG)",
    subtitle: "Household budget donut in AG style",
    style: "AG" as const,
    chart: <ExpenseBreakdownAgPieChart.Component />,
    height: 360,
    code: ExpenseBreakdownAgPieChart.code,
  },
  // Toast
  {
    title: "Programming Language Popularity",
    subtitle: "Developer survey results across 6 languages",
    style: "Toast" as const,
    chart: <ProgrammingLanguagePie.Component />,
    height: 360,
    code: ProgrammingLanguagePie.code,
  },
  // Toast — NEW: Budget Donut Dashboard
  {
    title: "Budget Donut Dashboard",
    subtitle: "Department budget as a dashboard-style donut with right legend",
    style: "Toast" as const,
    chart: <BudgetDonutDashboardPie.Component />,
    height: 360,
    code: BudgetDonutDashboardPie.code,
  },
  // Toast
  {
    title: "Developer Time Allocation",
    subtitle: "How engineers spend their workday as a donut chart",
    style: "Toast" as const,
    chart: <TimeAllocationPie.Component />,
    height: 360,
    code: TimeAllocationPie.code,
  },
  // AG
  {
    title: "Revenue by Region",
    subtitle: "Quarterly revenue split across 4 global regions",
    style: "AG" as const,
    chart: <DonutAgPieChart.Component />,
    featured: true,
    height: 360,
    code: DonutAgPieChart.code,
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
      toastSummary("pie-chart", <BasicPieChart.Component />),
      agSummary("pie-chart", <BasicAgPieChart.Component />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
