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
} from "./toast/examples";
import {
  QuarterlyEarningsAg,
  ProductComparisonAg,
  YearOverYearAg,
  TopCountriesAg,
  CustomerSegmentsAg,
  NegativePLAg,
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
  },
  // Financial
  {
    title: "Quarterly Earnings",
    subtitle: "Revenue and EBITDA by quarter",
    style: "AG",
    chart: <QuarterlyEarningsAg />,
  },
  {
    title: "Budget vs Actual",
    subtitle: "Quarterly spend tracking against plan",
    style: "Toast",
    chart: <BudgetVsActualToast />,
  },
  {
    title: "Profit & Loss",
    subtitle: "Net income and operating cash flow with negatives",
    style: "Toast",
    chart: <ProfitLossToast />,
  },
  {
    title: "Product Comparison",
    subtitle: "Competitive benchmarking across 5 metrics",
    style: "AG",
    chart: <ProductComparisonAg />,
  },
  // Comparison
  {
    title: "Monthly P&L Swings",
    subtitle: "Visualize volatile monthly swings",
    style: "AG",
    chart: <NegativePLAg />,
  },
  {
    title: "Year over Year Growth",
    subtitle: "2024 vs 2025 monthly comparison",
    style: "AG",
    chart: <YearOverYearAg />,
  },
  {
    title: "Survey Results",
    subtitle: "User satisfaction scores by category",
    style: "Toast",
    chart: <SurveyResultsToast />,
    height: 380,
  },
  // Demographics & Ranking
  {
    title: "Population by Age Group",
    subtitle: "Male vs female demographic distribution",
    style: "Toast",
    chart: <PopulationByAgeToast />,
    height: 400,
  },
  {
    title: "Top 10 Countries by GDP",
    subtitle: "World's largest economies at a glance",
    style: "AG",
    chart: <TopCountriesAg />,
    height: 420,
  },
  {
    title: "Top Performers",
    subtitle: "Identify your top contributors instantly",
    style: "Toast",
    chart: <TopPerformersToast />,
  },
  // Minimal
  {
    title: "Weekly Sales Tracker",
    subtitle: "Track daily throughput at a glance",
    style: "Toast",
    chart: <WeeklySalesTrackerToast />,
  },
  {
    title: "Customer Segments",
    subtitle: "New ARR, expansion, and churn by segment",
    style: "AG",
    chart: <CustomerSegmentsAg />,
  },
];

export const pages: ChartModule = [
  {
    slug: ["bar-chart"],
    title: "Bar Chart",
    description:
      "Grouped bars with negative values, horizontal layouts, and multi-series support.",
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
