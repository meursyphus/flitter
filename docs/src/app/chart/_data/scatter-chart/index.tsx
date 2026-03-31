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
    description: "custom.xAxisLabel rotates labels and formats GDP as $XK; y-axis appends \"yrs\" via axis.label.format",
    style: "Toast" as const,
    chart: <DefaultToastScatterChart.Component />,
    featured: true,
    height: 360,
    code: DefaultToastScatterChart.code,
  },
  {
    title: "Sales vs Marketing Spend",
    subtitle: "Revenue correlation across 4 product lines",
    description: "custom.scatter renders high-revenue points (>=140) as glowing rounded squares instead of circles",
    style: "Toast" as const,
    chart: <SalesVsMarketingToast.Component />,
    featured: true,
    height: 360,
    code: SalesVsMarketingToast.code,
  },
  {
    title: "Height vs Weight Distribution",
    subtitle: "Male and Female biometric clusters",
    description: "custom.legend renders pill-shaped badges with colored dot + tinted background per series",
    style: "Toast" as const,
    chart: <HeightWeightToast.Component />,
    height: 360,
    code: HeightWeightToast.code,
  },
  {
    title: "Real Estate Pricing",
    subtitle: "Price vs square footage across 3 neighborhoods",
    description: "custom.xAxisLabel appends \"ft2\" units; custom.yAxisLabel formats as $K/$M and bolds million-dollar values",
    style: "Toast" as const,
    chart: <RealEstatePriceToast.Component />,
    featured: true,
    height: 360,
    code: RealEstatePriceToast.code,
  },
  {
    title: "Renewable Energy Capacity",
    subtitle: "Solar, Wind, and Hydro across countries",
    description: "custom.yAxisLabel highlights efficiency values >=40% in bold green; legend positioned right-center",
    style: "Toast" as const,
    chart: <FilledToastScatterChart.Component />,
    height: 360,
    code: FilledToastScatterChart.code,
  },
  {
    title: "Startup Funding Rounds",
    subtitle: "Investment amounts across Series A, B, and C+",
    description: "custom.title renders a two-line header with purple underline border; axis formats values as $XB",
    style: "Toast" as const,
    chart: <LargeToastScatterChart.Component />,
    height: 360,
    code: LargeToastScatterChart.code,
  },
  {
    title: "R&D Investment Analysis",
    subtitle: "Research spending vs patent output across industries",
    description: "custom.dataLabel renders dark pill badges on each point; axis.label.format converts x-axis to $XM",
    style: "Toast" as const,
    chart: <RdInvestmentAnalysisToast.Component />,
    featured: true,
    height: 360,
    code: RdInvestmentAnalysisToast.code,
  },
  {
    title: "Performance Benchmark",
    subtitle: "Latency vs throughput for 3 backend systems",
    description: "custom.xAxisLabel highlights slow latency (>=50ms) in bold red; y-axis formats as K rps",
    style: "AG" as const,
    chart: <PerformanceBenchmarkAg.Component />,
    featured: true,
    height: 360,
    code: PerformanceBenchmarkAg.code,
  },
  {
    title: "Student Test Scores",
    subtitle: "Math vs Science performance across 3 classes",
    description: "custom.scatter turns top performers (avg>=85) into glowing squares; lower scorers render as faded circles",
    style: "AG" as const,
    chart: <StudentScoresAg.Component />,
    height: 360,
    code: StudentScoresAg.code,
  },
  {
    title: "Customer Satisfaction",
    subtitle: "Price vs satisfaction rating by product category",
    description: "custom.yAxisLabel prepends star icons and bolds ratings >=4.5; x-axis formats as dollar amounts",
    style: "AG" as const,
    chart: <CustomerSatisfactionAg.Component />,
    height: 360,
    code: CustomerSatisfactionAg.code,
  },
  {
    title: "Continental Overview",
    subtitle: "AG style with rotated GDP axis labels",
    description: "custom.xAxisLabel rotates and formats as $XK; subtle grid dash pattern on light background",
    style: "AG" as const,
    chart: <DefaultAgScatterChart.Component />,
    height: 360,
    code: DefaultAgScatterChart.code,
  },
  {
    title: "Server Resource Monitor",
    subtitle: "CPU, Memory, and Disk I/O across servers",
    description: "config.axis.label.format adds % and # units per axis; right-top legend with dashed grid",
    style: "AG" as const,
    chart: <FilledAgScatterChart.Component />,
    height: 360,
    code: FilledAgScatterChart.code,
  },
  {
    title: "Channel Performance",
    subtitle: "Marketing channel metrics with selective data labels",
    description: "custom.dataLabel only renders labels for high performers (y>=60); others show no label",
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
