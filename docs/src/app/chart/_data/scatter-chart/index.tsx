import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  DefaultToastScatterChart,
  FilledToastScatterChart,
  LargeToastScatterChart,
  SalesVsMarketingToast,
  HeightWeightToast,
  RealEstatePriceToast,
  RdInvestmentAnalysisToast,
} from "./toast/examples.generated";
import {
  DefaultAgScatterChart,
  FilledAgScatterChart,
  PerformanceBenchmarkAg,
  StudentScoresAg,
  CustomerSatisfactionAg,
  CompactCorrelationAg,
} from "./ag/examples.generated";
import { advancedPage } from "./advanced";

const basicCode = `import ScatterChart from "./charts/scatter-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = ScatterChart({
  data: {
    datasets: [
      {
        legend: "Series A",
        data: [
          { x: 10, y: 20, label: "Point 1" },
          { x: 30, y: 50, label: "Point 2" },
          { x: 50, y: 40, label: "Point 3" },
        ],
      },
    ],
  },
});

// Render with React
<Widget widget={chart} width={600} height={400} />`;

const showcaseExamples: ShowcaseExample[] = [
  {
    title: "GDP vs Life Expectancy",
    subtitle: "Global development indicators by continent",
    style: "Toast" as const,
    chart: <DefaultToastScatterChart.Component />,
    featured: true,
    height: 360,
    code: DefaultToastScatterChart.code,
  },
  {
    title: "Sales vs Marketing Spend",
    subtitle: "Revenue correlation across 4 product lines",
    style: "Toast" as const,
    chart: <SalesVsMarketingToast.Component />,
    featured: true,
    height: 360,
    code: SalesVsMarketingToast.code,
  },
  {
    title: "Height vs Weight Distribution",
    subtitle: "Male and Female biometric clusters",
    style: "Toast" as const,
    chart: <HeightWeightToast.Component />,
    height: 360,
    code: HeightWeightToast.code,
  },
  {
    title: "Real Estate Pricing",
    subtitle: "Price vs square footage across 3 neighborhoods",
    style: "Toast" as const,
    chart: <RealEstatePriceToast.Component />,
    featured: true,
    height: 360,
    code: RealEstatePriceToast.code,
  },
  {
    title: "Filled Data Points",
    subtitle: "Solid markers for high-density scatter plots",
    style: "Toast" as const,
    chart: <FilledToastScatterChart.Component />,
    height: 360,
    code: FilledToastScatterChart.code,
  },
  {
    title: "Large Markers",
    subtitle: "Emphasize key data points with larger scatter dots",
    style: "Toast" as const,
    chart: <LargeToastScatterChart.Component />,
    height: 360,
    code: LargeToastScatterChart.code,
  },
  {
    title: "R&D Investment Analysis",
    subtitle: "Research spending vs patent output across industries",
    style: "Toast" as const,
    chart: <RdInvestmentAnalysisToast.Component />,
    featured: true,
    height: 360,
    code: RdInvestmentAnalysisToast.code,
  },
  {
    title: "Performance Benchmark",
    subtitle: "Latency vs throughput for 3 backend systems",
    style: "AG" as const,
    chart: <PerformanceBenchmarkAg.Component />,
    featured: true,
    height: 360,
    code: PerformanceBenchmarkAg.code,
  },
  {
    title: "Student Test Scores",
    subtitle: "Math vs Science performance across 3 classes",
    style: "AG" as const,
    chart: <StudentScoresAg.Component />,
    height: 360,
    code: StudentScoresAg.code,
  },
  {
    title: "Customer Satisfaction",
    subtitle: "Price vs satisfaction rating by product category",
    style: "AG" as const,
    chart: <CustomerSatisfactionAg.Component />,
    height: 360,
    code: CustomerSatisfactionAg.code,
  },
  {
    title: "Continental Overview",
    subtitle: "AG style with clean data point rendering",
    style: "AG" as const,
    chart: <DefaultAgScatterChart.Component />,
    height: 360,
    code: DefaultAgScatterChart.code,
  },
  {
    title: "Sized Data Points",
    subtitle: "Larger markers for presentation-ready charts",
    style: "AG" as const,
    chart: <FilledAgScatterChart.Component />,
    height: 360,
    code: FilledAgScatterChart.code,
  },
  {
    title: "Compact Correlation View",
    subtitle: "Marketing channel metrics with clean analytical style",
    style: "AG" as const,
    chart: <CompactCorrelationAg.Component />,
    height: 360,
    code: CompactCorrelationAg.code,
  },
];

export const pages: ChartModule = [
  {
    slug: ["scatter-chart"],
    title: "Scatter Chart",
    description:
      "Explore relationships between two variables. Correlation, clustering, outlier detection — plot the data and see what emerges.",
    pageType: "overview",
    quickStartCode: basicCode,
    hasAdvanced: true,
    showcaseExamples,
    styles: [
      toastSummary("scatter-chart", <DefaultToastScatterChart.Component />),
      agSummary("scatter-chart", <DefaultAgScatterChart.Component />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
