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
  RevenueNegativeDipsToastLine,
  CompactSparklineToastLine,
} from "./toast/examples.generated";
import {
  DefaultAgLineChart,
  SplineAgLineChart,
  StockPriceAgLineChart,
  WebAnalyticsAgLine,
  MonthlySalesAgLine,
  CryptoTrendAgLine,
  ApiMonitoringAgLine,
} from "./ag/examples.generated";
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
    chart: <DefaultToastLineChart.Component />,
    featured: true,
    height: 360,
    code: DefaultToastLineChart.code,
  },
  {
    title: "Revenue vs Expenses",
    subtitle: "Monthly revenue and expense tracking over 8 months",
    style: "Toast" as const,
    chart: <RevenueExpensesToastLine.Component />,
    height: 360,
    code: RevenueExpensesToastLine.code,
  },
  {
    title: "Smooth Trend Analysis",
    subtitle: "Spline interpolation for polished data visualization",
    style: "AG" as const,
    chart: <SplineAgLineChart.Component />,
    height: 360,
    code: SplineAgLineChart.code,
  },
  {
    title: "Server Response Times",
    subtitle: "API latency percentiles (p50, p95, p99) over 24 hours with spline curves",
    style: "Toast" as const,
    chart: <ServerResponseToastLine.Component />,
    featured: true,
    height: 380,
    code: ServerResponseToastLine.code,
  },
  {
    title: "Web Analytics Dashboard",
    subtitle: "Pageviews, sessions, and bounce rate over a year",
    style: "AG" as const,
    chart: <WebAnalyticsAgLine.Component />,
    height: 360,
    code: WebAnalyticsAgLine.code,
  },
  {
    title: "Fitness Tracker",
    subtitle: "Steps, calories, and distance across a week",
    style: "Toast" as const,
    chart: <FitnessTrackerToastLine.Component />,
    height: 360,
    code: FitnessTrackerToastLine.code,
  },
  {
    title: "Monthly Product Sales",
    subtitle: "Three product lines with smooth spline curves across seasons",
    style: "AG" as const,
    chart: <MonthlySalesAgLine.Component />,
    featured: true,
    height: 380,
    code: MonthlySalesAgLine.code,
  },
  {
    title: "Temperature Trends",
    subtitle: "Annual temperature curves for Tokyo, London, and New York",
    style: "Toast" as const,
    chart: <TemperatureTrendToastLine.Component />,
    height: 380,
    code: TemperatureTrendToastLine.code,
  },
  {
    title: "Multi-Metric Dashboard",
    subtitle: "Revenue, users, conversion, and churn tracked together over 12 months",
    style: "Toast" as const,
    chart: <MultiMetricToastLineChart.Component />,
    height: 360,
    code: MultiMetricToastLineChart.code,
  },
  {
    title: "Crypto Market Trends",
    subtitle: "BTC, ETH, and SOL price movements through a bear market",
    style: "AG" as const,
    chart: <CryptoTrendAgLine.Component />,
    height: 360,
    code: CryptoTrendAgLine.code,
  },
  {
    title: "Stock Price Trends",
    subtitle: "AAPL, GOOGL, and MSFT price movement over a year",
    style: "AG" as const,
    chart: <StockPriceAgLineChart.Component />,
    height: 360,
    code: StockPriceAgLineChart.code,
  },
  {
    title: "Spline Curves",
    subtitle: "Smooth curves revealing seasonal patterns",
    style: "Toast" as const,
    chart: <SplineToastLineChart.Component />,
    height: 360,
    code: SplineToastLineChart.code,
  },
  {
    title: "Revenue Trend with Negative Dips",
    subtitle: "Net revenue and operating cash crossing zero baseline",
    style: "Toast" as const,
    chart: <RevenueNegativeDipsToastLine.Component />,
    height: 360,
    code: RevenueNegativeDipsToastLine.code,
  },
  {
    title: "API Monitoring Panel",
    subtitle: "Server response time with average and peak latency",
    style: "AG" as const,
    chart: <ApiMonitoringAgLine.Component />,
    height: 360,
    code: ApiMonitoringAgLine.code,
  },
  {
    title: "Compact Sparkline",
    subtitle: "Minimal inline trend visualization without axes or legend",
    style: "Toast" as const,
    chart: <CompactSparklineToastLine.Component />,
    height: 200,
    code: CompactSparklineToastLine.code,
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
      toastSummary("line-chart", <DefaultToastLineChart.Component />),
      agSummary("line-chart", <DefaultAgLineChart.Component />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
