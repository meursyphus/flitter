import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  FeaturedRevenueToast,
  ConditionalPLToast,
  HorizontalRankingToast,
  MonthlyRevenueToast,
  BudgetVsActualToast,
  ProfitLossToast,
  SurveyResultsToast,
  WeeklySalesTrackerToast,
  TopPerformersToast,
  PopulationByAgeToast,
} from "./toast/examples.generated";
import {
  ExecutiveRevenueAg,
  ProductComparisonAg,
  QuarterlyEarningsAg,
  YearOverYearAg,
  TopCountriesAg,
  CustomerSegmentsAg,
} from "./ag/examples.generated";
import { advancedPage } from "./advanced";

const showcaseExamples: ShowcaseExample[] = [
  {
    description:
      "config.legend position: right-center with 3-series grouped bars and visible title.",
    style: "Toast",
    chart: <FeaturedRevenueToast.Component />,
    featured: true,
    code: FeaturedRevenueToast.code,
  },
  {
    description:
      "custom.bar — returns a Container whose color switches between green and red based on the value sign.",
    style: "Toast",
    chart: <ConditionalPLToast.Component />,
    code: ConditionalPLToast.code,
  },
  {
    description:
      "custom.yAxisLabel — prepends a bold rank number using Row + Text, reading font from context.config.",
    style: "Toast",
    chart: <HorizontalRankingToast.Component />,
    height: 380,
    code: HorizontalRankingToast.code,
  },
  {
    description:
      "config.bar cornerRadius: 32 for rounded bars. custom.bar applies score-tier colors (green ≥90, amber ≥80, gray otherwise).",
    style: "Toast",
    chart: <SurveyResultsToast.Component />,
    height: 380,
    code: SurveyResultsToast.code,
  },
  {
    description:
      "custom.yAxisLabel — highlights the zero baseline in red bold while other labels stay neutral.",
    style: "Toast",
    chart: <ProfitLossToast.Component />,
    code: ProfitLossToast.code,
  },
  {
    description:
      "custom.xAxisLabel — wraps each label in Transform.rotate(−45°) for long day-of-week names.",
    style: "Toast",
    chart: <WeeklySalesTrackerToast.Component />,
    code: WeeklySalesTrackerToast.code,
  },
  {
    description:
      "custom.title — centered Column with background color, emoji, and subtitle text inside a rounded Container.",
    style: "Toast",
    chart: <TopPerformersToast.Component />,
    code: TopPerformersToast.code,
  },
  {
    description:
      "Label strings contain \\n for multi-line x-axis labels (e.g. \"Under\\n14\"). config.legend position: right-center.",
    style: "Toast",
    chart: <PopulationByAgeToast.Component />,
    code: PopulationByAgeToast.code,
  },
  {
    description:
      "custom.dataLabel — renders \"$120K\" above Actual bars only; returns empty Text for Budget series.",
    style: "Toast",
    chart: <BudgetVsActualToast.Component />,
    code: BudgetVsActualToast.code,
  },
  {
    description:
      "custom.title — Column with Row for colored keyword, border-bottom accent, and gray subtitle.",
    style: "AG",
    chart: <ExecutiveRevenueAg.Component />,
    code: ExecutiveRevenueAg.code,
  },
  {
    description:
      "custom.xAxisLabel — wraps each label in a Container with light-blue background and rounded corners.",
    style: "AG",
    chart: <ProductComparisonAg.Component />,
    code: ProductComparisonAg.code,
  },
  {
    description:
      "config.bar cornerRadius: 32 for rounded bars. Extra padding for breathing room.",
    style: "AG",
    chart: <QuarterlyEarningsAg.Component />,
    code: QuarterlyEarningsAg.code,
  },
  {
    description:
      "config.title position: bottom — places the chart title below the plot area.",
    style: "AG",
    chart: <YearOverYearAg.Component />,
    code: YearOverYearAg.code,
  },
  {
    description:
      "custom.yAxisLabel — prepends country flag emoji from a lookup map using Row + Text.",
    style: "AG",
    chart: <TopCountriesAg.Component />,
    height: 420,
    code: TopCountriesAg.code,
  },
  {
    description:
      "custom.bar — applies BoxShadow glow on negative (churn) values. Per-dataset color via context.legends index.",
    style: "AG",
    chart: <CustomerSegmentsAg.Component />,
    code: CustomerSegmentsAg.code,
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
      toastSummary("bar-chart", <MonthlyRevenueToast.Component />),
      agSummary("bar-chart", <ExecutiveRevenueAg.Component />),
    ],
    showcaseExamples,
    hasAdvanced: true,
  },
  toastStyle,
  agStyle,
  advancedPage,
];
