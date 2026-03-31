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
    description: "custom.xAxisLabel highlights quarter-end months (Mar, Jun, Sep, Dec) with green badge backgrounds to mark fiscal boundaries.",
    style: "Toast" as const,
    chart: <DefaultToastLineChart.Component />,
    featured: true,
    height: 360,
    code: DefaultToastLineChart.code,
  },
  {
    description: "config.title with position: \"bottom\" and alignment: \"center\" places the chart title beneath the plot area.",
    style: "Toast" as const,
    chart: <RevenueExpensesToastLine.Component />,
    height: 360,
    code: RevenueExpensesToastLine.code,
  },
  {
    description: "config.subtitle enabled alongside spline curves and dashed grid lines (grid.dash: [4,4]).",
    style: "AG" as const,
    chart: <SplineAgLineChart.Component />,
    height: 360,
    code: SplineAgLineChart.code,
  },
  {
    description: "custom.yAxisLabel colors latency values red and bold when they exceed 500ms threshold -- visual SLA breach warning.",
    style: "Toast" as const,
    chart: <ServerResponseToastLine.Component />,
    featured: true,
    height: 380,
    code: ServerResponseToastLine.code,
  },
  {
    description: "custom.xAxisLabel renders multi-line labels: month name in bold above a smaller year subtitle using Column layout.",
    style: "AG" as const,
    chart: <WebAnalyticsAgLine.Component />,
    height: 380,
    code: WebAnalyticsAgLine.code,
  },
  {
    description: "custom.legend renders each series as a colored pill badge with a circle dot and tinted background using BorderRadius.circular.",
    style: "Toast" as const,
    chart: <FitnessTrackerToastLine.Component />,
    height: 360,
    code: FitnessTrackerToastLine.code,
  },
  {
    description: "config.title centered with alignment: \"center\" and config.legend at position: \"top\" for a report-style header layout.",
    style: "AG" as const,
    chart: <MonthlySalesAgLine.Component />,
    featured: true,
    height: 380,
    code: MonthlySalesAgLine.code,
  },
  {
    description: "config.axis.label.format appends a degree-Celsius symbol to Y-axis values for temperature context.",
    style: "Toast" as const,
    chart: <TemperatureTrendToastLine.Component />,
    height: 380,
    code: TemperatureTrendToastLine.code,
  },
  {
    description: "custom.dataLabel shows the final data point value for each series, colored to match its line, as an end-of-line annotation.",
    style: "Toast" as const,
    chart: <MultiMetricToastLineChart.Component />,
    height: 360,
    code: MultiMetricToastLineChart.code,
  },
  {
    description: "Full dark theme via config: background, title.color, axis.label.color, grid.color, and legend.color all coordinated for dark UI.",
    style: "AG" as const,
    chart: <CryptoTrendAgLine.Component />,
    height: 360,
    code: CryptoTrendAgLine.code,
  },
  {
    description: "config.axis.label.format prefixes Y-axis values with $ for currency display on a light #fafafa background.",
    style: "AG" as const,
    chart: <StockPriceAgLineChart.Component />,
    height: 360,
    code: StockPriceAgLineChart.code,
  },
  {
    description: "custom.gridYLine and custom.gridXLine replace default grid with custom Container-based solid lines for precise grid styling.",
    style: "Toast" as const,
    chart: <SplineToastLineChart.Component />,
    height: 360,
    code: SplineToastLineChart.code,
  },
  {
    description: "custom.yAxisLabel colors negative values red, positive values green, and bolds the zero baseline for P&L clarity.",
    style: "Toast" as const,
    chart: <RevenueNegativeDipsToastLine.Component />,
    height: 360,
    code: RevenueNegativeDipsToastLine.code,
  },
  {
    description: "config.axis.tick enabled with size: 8, axis.label.format appends \"ms\" suffix, and grid.xLine visible for cross-hatch monitoring view.",
    style: "AG" as const,
    chart: <ApiMonitoringAgLine.Component />,
    height: 360,
    code: ApiMonitoringAgLine.code,
  },
  {
    description: "Sparkline mode: config.legend.visible: false with minimal padding (4px all sides) strips the chart to a bare inline trend.",
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
