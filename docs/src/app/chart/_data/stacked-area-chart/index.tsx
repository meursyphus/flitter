import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  DefaultToastStackedAreaChart,
  TrafficSourceStackedArea,
  RevenueStreamStackedArea,
  EnergyMixToastStackedArea,
  AppUsageToastStackedArea,
  SupportTicketsToastStackedArea,
  AcquisitionChannelsToast,
} from "./toast/examples.generated";
import {
  DefaultAgStackedAreaChart,
  ResourceAllocationStackedArea,
  CloudCostAgStackedArea,
  TeamVelocityAgStackedArea,
  MarketShareAgStackedArea,
  RevenueStreamsMinimalAg,
} from "./ag/examples.generated";
import { advancedPage } from "./advanced";

const basicCode = `import StackedAreaChart from "./charts/stacked-area-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = StackedAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      { legend: "Organic", values: [400, 450, 420, 480] },
      { legend: "Direct", values: [200, 220, 210, 230] },
    ],
  },
});

// Render with React
<Widget widget={chart} width={600} height={400} />`;

const showcaseExamples: ShowcaseExample[] = [
  {
    title: "Traffic Source Breakdown",
    subtitle: "Organic, direct, social, and referral traffic over 12 months",
    description: "Custom title with indigo background badge and subtitle text",
    style: "Toast" as const,
    chart: <DefaultToastStackedAreaChart.Component />,
    featured: true,
    height: 360,
    code: DefaultToastStackedAreaChart.code,
  },
  {
    title: "Website Traffic by Source",
    subtitle: "Search, social, email, and direct visits trending upward",
    description: "Rotated x-axis labels with quarterly emphasis (bold every 3rd month)",
    style: "Toast" as const,
    chart: <TrafficSourceStackedArea.Component />,
    height: 360,
    code: TrafficSourceStackedArea.code,
  },
  {
    title: "Revenue by Product Line",
    subtitle: "Quarterly revenue streams from subscriptions, licensing, services, and hardware",
    description: "Custom y-axis labels with currency formatting ($XK) and teal threshold highlighting",
    style: "Toast" as const,
    chart: <RevenueStreamStackedArea.Component />,
    featured: true,
    height: 360,
    code: RevenueStreamStackedArea.code,
  },
  {
    title: "Revenue Stream Composition",
    subtitle: "AG style with centered title and subtitle",
    description: "Centered title with subtitle annotation on neutral background",
    style: "AG" as const,
    chart: <DefaultAgStackedAreaChart.Component />,
    height: 360,
    code: DefaultAgStackedAreaChart.code,
  },
  {
    title: "Resource Allocation per Sprint",
    subtitle: "AG style team capacity with hour-suffixed y-axis labels",
    description: "Custom y-axis labels showing 'hrs' suffix with red bold when over capacity (80+)",
    style: "AG" as const,
    chart: <ResourceAllocationStackedArea.Component />,
    featured: true,
    height: 360,
    code: ResourceAllocationStackedArea.code,
  },
  {
    title: "Energy Generation Mix",
    subtitle: "Monthly power output with spline curves and peak-month legend",
    description: "Right-side custom legend with peak month annotation per energy source",
    style: "Toast" as const,
    chart: <EnergyMixToastStackedArea.Component />,
    featured: true,
    height: 360,
    code: EnergyMixToastStackedArea.code,
  },
  {
    title: "App Sessions by Platform",
    subtitle: "iOS, Android, and web session trends with quarter-start markers",
    description: "Top legend + quarter-start x-axis labels underlined in blue with bold styling",
    style: "Toast" as const,
    chart: <AppUsageToastStackedArea.Component />,
    height: 360,
    code: AppUsageToastStackedArea.code,
  },
  {
    title: "Support Ticket Trends",
    subtitle: "Bug reports, feature requests, questions, and billing tickets over time",
    description: "Summer months highlighted with amber badge-style x-axis labels",
    style: "Toast" as const,
    chart: <SupportTicketsToastStackedArea.Component />,
    height: 360,
    code: SupportTicketsToastStackedArea.code,
  },
  {
    title: "Cloud Infrastructure Costs",
    subtitle: "Monthly spend with dollar-formatted y-axis and budget alerts",
    description: "Custom y-axis with $XK currency format and red bold for budget-exceeding values",
    style: "AG" as const,
    chart: <CloudCostAgStackedArea.Component />,
    featured: true,
    height: 360,
    code: CloudCostAgStackedArea.code,
  },
  {
    title: "Team Velocity by Squad",
    subtitle: "Spline curves with abbreviated sprint labels and point suffixes",
    description: "Config-level axis.label.format for 'S1' sprint abbreviations and 'pts' y-axis suffix, right legend",
    style: "AG" as const,
    chart: <TeamVelocityAgStackedArea.Component />,
    height: 360,
    code: TeamVelocityAgStackedArea.code,
  },
  {
    title: "Browser Market Share",
    subtitle: "Percentage y-axis with quarterly-highlighted x-axis badges",
    description: "Percentage-formatted y-axis via config + custom x-axis with pill badges on quarter starts",
    style: "AG" as const,
    chart: <MarketShareAgStackedArea.Component />,
    height: 360,
    code: MarketShareAgStackedArea.code,
  },
  {
    title: "Acquisition Channels",
    subtitle: "Organic, paid, and referral traffic with right-side legend layout",
    description: "Custom legend with colored dot, channel name, and latest value in bold",
    style: "Toast" as const,
    chart: <AcquisitionChannelsToast.Component />,
    height: 360,
    code: AcquisitionChannelsToast.code,
  },
  {
    title: "Revenue Streams (Minimal)",
    subtitle: "Clean minimal design with pill-shaped title and metadata",
    description: "Custom title as rounded pill container with segment count metadata",
    style: "AG" as const,
    chart: <RevenueStreamsMinimalAg.Component />,
    height: 360,
    code: RevenueStreamsMinimalAg.code,
  },
];

export const pages: ChartModule = [
  {
    slug: ["stacked-area-chart"],
    title: "Stacked Area Chart",
    description:
      "Track how composition changes over time. Traffic sources, revenue streams, resource allocation — the area fills tell the story.",
    pageType: "overview",
    quickStartCode: basicCode,
    hasAdvanced: true,
    showcaseExamples,
    styles: [
      toastSummary("stacked-area-chart", <DefaultToastStackedAreaChart.Component />),
      agSummary("stacked-area-chart", <DefaultAgStackedAreaChart.Component />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
