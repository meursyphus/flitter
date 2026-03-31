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
    title: "Market Indicators Overview",
    subtitle: "Housing, employment, and CPI trends with filled areas",
    style: "Toast" as const,
    chart: <DefaultToastAreaChart.Component />,
    featured: true,
    height: 360,
    code: DefaultToastAreaChart.code,
  },
  {
    title: "Cash Flow with Negative Dips",
    subtitle: "Operating and net P&L crossing zero to show positive and negative regions",
    style: "Toast" as const,
    chart: <CashFlowToastArea.Component />,
    featured: true,
    height: 380,
    code: CashFlowToastArea.code,
  },
  {
    title: "Revenue Growth",
    subtitle: "Quarterly revenue vs costs showing expanding margins",
    style: "Toast" as const,
    chart: <RevenueGrowthToastArea.Component />,
    height: 360,
    code: RevenueGrowthToastArea.code,
  },
  {
    title: "Smooth Revenue Forecast",
    subtitle: "Spline curves for polished financial reporting",
    style: "AG" as const,
    chart: <SplineAgAreaChart.Component />,
    height: 360,
    code: SplineAgAreaChart.code,
  },
  {
    title: "Network Traffic",
    subtitle: "Inbound and outbound bandwidth over 24 hours with smooth curves",
    style: "Toast" as const,
    chart: <NetworkTrafficToastArea.Component />,
    featured: true,
    height: 380,
    code: NetworkTrafficToastArea.code,
  },
  {
    title: "Cloud Infrastructure Costs",
    subtitle: "Compute, storage, and network spend across the year",
    style: "AG" as const,
    chart: <CloudUsageAgArea.Component />,
    height: 360,
    code: CloudUsageAgArea.code,
  },
  {
    title: "Growth Analytics with Right Legend",
    subtitle: "MRR, ARR, and NRR growth metrics with right-aligned legend",
    style: "Toast" as const,
    chart: <GrowthAnalyticsToastArea.Component />,
    height: 380,
    code: GrowthAnalyticsToastArea.code,
  },
  {
    title: "User Engagement Metrics",
    subtitle: "DAU, WAU, and MAU growth over the year",
    style: "Toast" as const,
    chart: <UserEngagementToastArea.Component />,
    height: 380,
    code: UserEngagementToastArea.code,
  },
  {
    title: "Dark Monitoring Panel",
    subtitle: "Network traffic and errors on a dark ops dashboard theme",
    style: "AG" as const,
    chart: <DarkMonitoringAgArea.Component />,
    featured: true,
    height: 400,
    code: DarkMonitoringAgArea.code,
  },
  {
    title: "App Performance Monitor",
    subtitle: "CPU and memory utilization over 24 hours with spline smoothing",
    style: "AG" as const,
    chart: <AppPerformanceAgArea.Component />,
    height: 360,
    code: AppPerformanceAgArea.code,
  },
  {
    title: "Energy Mix",
    subtitle: "Solar, wind, and grid power consumption through the seasons",
    style: "Toast" as const,
    chart: <EnergyConsumptionToastArea.Component />,
    height: 380,
    code: EnergyConsumptionToastArea.code,
  },
  {
    title: "SaaS vs On-Prem Revenue",
    subtitle: "Quarterly revenue shift from on-premise to cloud subscriptions",
    style: "AG" as const,
    chart: <QuarterlyRevenueAgArea.Component />,
    height: 360,
    code: QuarterlyRevenueAgArea.code,
  },
  {
    title: "Seasonal Patterns",
    subtitle: "Spline areas highlighting cyclical trends",
    style: "Toast" as const,
    chart: <SplineToastAreaChart.Component />,
    height: 360,
    code: SplineToastAreaChart.code,
  },
  {
    title: "Multi-Series Comparison",
    subtitle: "Three economic indicators with angular precision",
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
