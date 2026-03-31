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
  // Featured hero — AG: title + subtitle + bottom legend
  {
    title: "Browser Market Share",
    subtitle: "Global browser usage distribution across 5 platforms",
    description:
      "Centered title with subtitle and bottom-positioned legend for a polished dashboard look.",
    style: "AG" as const,
    chart: <BasicAgPieChart.Component />,
    featured: true,
    height: 360,
    code: BasicAgPieChart.code,
  },
  // Toast: donut with inline name+percentage labels, no legend
  {
    title: "Budget Allocation Donut",
    subtitle: "Department spend breakdown with inner cutout",
    description:
      "Data labels show name + percentage directly on slices; legend hidden for a clean minimal look.",
    style: "Toast" as const,
    chart: <DonutPieChart.Component />,
    height: 360,
    code: DonutPieChart.code,
  },
  // AG: thick stroke separator + name(%) data label formatter
  {
    title: "Smartphone Market Share",
    subtitle: "Global smartphone vendor share with 6 segments",
    description:
      "Thick white stroke separators and a custom data-label formatter showing name with percentage.",
    style: "AG" as const,
    chart: <MarketShareAgPieChart.Component />,
    featured: true,
    height: 360,
    code: MarketShareAgPieChart.code,
  },
  // Toast: title + dollar-amount data labels for large slices only
  {
    title: "Monthly Expense Breakdown",
    subtitle: "Household budget across 8 categories as a donut chart",
    description:
      "Top-left title and a conditional data-label formatter that only shows dollar amounts on slices >= $500.",
    style: "Toast" as const,
    chart: <ExpenseBreakdownPieChart.Component />,
    height: 360,
    code: ExpenseBreakdownPieChart.code,
  },
  // AG: title + name:value data labels, legend hidden
  {
    title: "Global Energy Mix",
    subtitle: "Power generation share by fuel source across 6 types",
    description:
      "Left-aligned title, legend hidden, and data labels formatted as 'Name: Value%' for a report style.",
    style: "AG" as const,
    chart: <EnergyMixAgPie.Component />,
    featured: true,
    height: 360,
    code: EnergyMixAgPie.code,
  },
  // Toast: centered title + bottom legend with wider gap
  {
    title: "Website Traffic Sources",
    subtitle: "Visitor acquisition channels as a donut chart",
    description:
      "Center-aligned title with custom font weight, and bottom legend with increased gap for readability.",
    style: "Toast" as const,
    chart: <TrafficSourcePie.Component />,
    height: 360,
    code: TrafficSourcePie.code,
  },
  // AG — bottom title + subtitle
  {
    title: "Quarterly Report Figure",
    subtitle: "Revenue split with bottom-positioned title for report layouts",
    description:
      "Title positioned at the bottom with subtitle — ideal for embedding in printed reports.",
    style: "AG" as const,
    chart: <QuarterlyReportAgPie.Component />,
    featured: true,
    height: 360,
    code: QuarterlyReportAgPie.code,
  },
  // AG: donut + right legend with custom dollar amounts
  {
    title: "Expense Breakdown (AG)",
    subtitle: "Household budget donut in AG style",
    description:
      "Custom legend with square color markers and dollar amounts beside each category name.",
    style: "AG" as const,
    chart: <ExpenseBreakdownAgPieChart.Component />,
    height: 360,
    code: ExpenseBreakdownAgPieChart.code,
  },
  // Toast: full-pie with inline name+% labels, no legend
  {
    title: "Programming Language Popularity",
    subtitle: "Developer survey results across 6 languages",
    description:
      "Legend hidden; each slice carries a bold inline label with language name and percentage.",
    style: "Toast" as const,
    chart: <ProgrammingLanguagePie.Component />,
    height: 360,
    code: ProgrammingLanguagePie.code,
  },
  // Toast — custom legend with dollar amounts
  {
    title: "Budget Donut Dashboard",
    subtitle: "Department budget as a dashboard-style donut with right legend",
    description:
      "Custom legend renders dollar amounts next to each item with rounded color dots.",
    style: "Toast" as const,
    chart: <BudgetDonutDashboardPie.Component />,
    height: 360,
    code: BudgetDonutDashboardPie.code,
  },
  // Toast: right legend with percentage values
  {
    title: "Developer Time Allocation",
    subtitle: "How engineers spend their workday as a donut chart",
    description:
      "Custom legend on the right shows each activity with its percentage alongside a circle marker.",
    style: "Toast" as const,
    chart: <TimeAllocationPie.Component />,
    height: 360,
    code: TimeAllocationPie.code,
  },
  // AG: wide donut + centered title + percentage data labels + bottom legend
  {
    title: "Revenue by Region",
    subtitle: "Quarterly revenue split across 4 global regions",
    description:
      "Wide donut (65% inner radius) with centered title, percentage-only data labels, and bottom legend.",
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
