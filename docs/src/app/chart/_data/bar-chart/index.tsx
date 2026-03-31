import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  FeaturedRevenueToast,
  KpiCurrencyToast,
  ConditionalPLToast,
  HorizontalRankingToast,
  MonthlyRevenueToast,
} from "./toast/examples.generated";
import {
  ExecutiveRevenueAg,
  ProductComparisonAg,
} from "./ag/examples.generated";
import { advancedPage } from "./advanced";

const showcaseExamples: ShowcaseExample[] = [
  {
    title: "Monthly Revenue",
    subtitle: "Regional breakdown with right-side legend",
    style: "Toast",
    chart: <FeaturedRevenueToast.Component />,
    featured: true,
    code: FeaturedRevenueToast.code,
  },
  {
    title: "KPI Currency Formatting",
    subtitle: "Y-axis formatted as $K for finance dashboards",
    style: "Toast",
    chart: <KpiCurrencyToast.Component />,
    code: KpiCurrencyToast.code,
  },
  {
    title: "Conditional P&L",
    subtitle: "Green/red bars based on positive/negative values",
    style: "Toast",
    chart: <ConditionalPLToast.Component />,
    code: ConditionalPLToast.code,
  },
  {
    title: "Horizontal Ranking",
    subtitle: "Custom yAxisLabel with rank numbers from context.config",
    style: "Toast",
    chart: <HorizontalRankingToast.Component />,
    height: 380,
    code: HorizontalRankingToast.code,
  },
  {
    title: "Branded Title",
    subtitle: "Column + Row title with highlighted text and subtitle",
    style: "AG",
    chart: <ExecutiveRevenueAg.Component />,
    code: ExecutiveRevenueAg.code,
  },
  {
    title: "Styled Labels",
    subtitle: "X-axis labels with background badges using config font",
    style: "AG",
    chart: <ProductComparisonAg.Component />,
    code: ProductComparisonAg.code,
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
