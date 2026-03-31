import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  DefaultToastAreaChart,
  SplineToastAreaChart,
  RevenueGrowthToastArea,
  NetworkTrafficToastArea,
  UserEngagementToastArea,
  EnergyConsumptionToastArea,
  GrowthAnalyticsToastArea,
  CashFlowToastArea,
} from "./toast/examples.generated";
import {
  DefaultAgAreaChart,
  SplineAgAreaChart,
  CloudUsageAgArea,
  AppPerformanceAgArea,
  QuarterlyRevenueAgArea,
  DarkMonitoringAgArea,
} from "./ag/examples.generated";
import { advancedPage } from "./advanced";

const basicCode = `import AreaChart from "./charts/area-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = AreaChart({
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
    description:
      "custom.xAxisLabel — wraps long month names in Transform.rotate(-30deg) for angled readability.",
    style: "Toast" as const,
    chart: <DefaultToastAreaChart.Component />,
    featured: true,
    height: 360,
    code: DefaultToastAreaChart.code,
  },
  {
    description:
      "custom.yAxisLabel — colors negative values red, positive green, and bolds the zero baseline.",
    style: "Toast" as const,
    chart: <CashFlowToastArea.Component />,
    featured: true,
    height: 380,
    code: CashFlowToastArea.code,
  },
  {
    description:
      "custom.dataLabel — renders \"$X.XM\" only on the last data point per series. config.title visible.",
    style: "Toast" as const,
    chart: <RevenueGrowthToastArea.Component />,
    height: 360,
    code: RevenueGrowthToastArea.code,
  },
  {
    description:
      "custom.xAxisLabel — underlines every quarter-start label with a purple BorderSide accent.",
    style: "AG" as const,
    chart: <SplineAgAreaChart.Component />,
    height: 360,
    code: SplineAgAreaChart.code,
  },
  {
    description:
      "custom.title — Column with left border accent, bold heading, and gray subtitle inside a Container.",
    style: "Toast" as const,
    chart: <NetworkTrafficToastArea.Component />,
    featured: true,
    height: 380,
    code: NetworkTrafficToastArea.code,
  },
  {
    description:
      "Multi-line labels via \\n (\"Jan\\nQ1\"). custom.yAxisLabel prepends \"$\" and appends \"K\" suffix.",
    style: "AG" as const,
    chart: <CloudUsageAgArea.Component />,
    height: 360,
    code: CloudUsageAgArea.code,
  },
  {
    description:
      "custom.legend — Row with rounded color dot, metric name, and latest value in bold accent color.",
    style: "Toast" as const,
    chart: <GrowthAnalyticsToastArea.Component />,
    height: 380,
    code: GrowthAnalyticsToastArea.code,
  },
  {
    description:
      "config.title position: bottom. custom.yAxisLabel — formats large numbers as \"XK\" and highlights values >= 200 in indigo.",
    style: "Toast" as const,
    chart: <UserEngagementToastArea.Component />,
    height: 380,
    code: UserEngagementToastArea.code,
  },
  {
    description:
      "custom.legend — neon glow BoxShadow on color dots for dark theme. Dark background, translucent grid and axis.",
    style: "AG" as const,
    chart: <DarkMonitoringAgArea.Component />,
    featured: true,
    height: 400,
    code: DarkMonitoringAgArea.code,
  },
  {
    description:
      "custom.yAxisLabel — appends \"%\" suffix and turns red + bold when utilization >= 70%.",
    style: "AG" as const,
    chart: <AppPerformanceAgArea.Component />,
    height: 360,
    code: AppPerformanceAgArea.code,
  },
  {
    description:
      "custom.legend — emoji icons in tinted rounded squares. config.legend position: right for vertical layout.",
    style: "Toast" as const,
    chart: <EnergyConsumptionToastArea.Component />,
    height: 380,
    code: EnergyConsumptionToastArea.code,
  },
  {
    description:
      "config.title position: bottom. custom.xAxisLabel — bolds Q4 labels in teal to mark fiscal year-end.",
    style: "AG" as const,
    chart: <QuarterlyRevenueAgArea.Component />,
    height: 360,
    code: QuarterlyRevenueAgArea.code,
  },
  {
    description:
      "custom.xAxisLabel — quarter-start months get a slate background badge with rounded corners and bold text.",
    style: "Toast" as const,
    chart: <SplineToastAreaChart.Component />,
    height: 360,
    code: SplineToastAreaChart.code,
  },
  {
    description:
      "custom.yAxisLabel — highlights values >= 10 in bold amber to flag outlier thresholds.",
    style: "AG" as const,
    chart: <DefaultAgAreaChart.Component />,
    height: 360,
    code: DefaultAgAreaChart.code,
  },
];

export const pages: ChartModule = [
  {
    slug: ["area-chart"],
    title: "Area Chart",
    description:
      "Line charts with weight. Fill the area under the curve to emphasize volume, show composition, or highlight cumulative trends.",
    pageType: "overview",
    quickStartCode: basicCode,
    showcaseExamples,
    styles: [
      toastSummary("area-chart", <DefaultToastAreaChart.Component />),
      agSummary("area-chart", <DefaultAgAreaChart.Component />),
    ],
    hasAdvanced: true,
  },
  toastStyle,
  agStyle,
  advancedPage,
];
