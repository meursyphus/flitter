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
    style: "Toast" as const,
    chart: <DefaultToastStackedAreaChart.Component />,
    featured: true,
    height: 360,
    code: DefaultToastStackedAreaChart.code,
  },
  {
    title: "Website Traffic by Source",
    subtitle: "Search, social, email, and direct visits trending upward",
    style: "Toast" as const,
    chart: <TrafficSourceStackedArea.Component />,
    height: 360,
    code: TrafficSourceStackedArea.code,
  },
  {
    title: "Revenue by Product Line",
    subtitle: "Quarterly revenue streams from subscriptions, licensing, services, and hardware",
    style: "Toast" as const,
    chart: <RevenueStreamStackedArea.Component />,
    featured: true,
    height: 360,
    code: RevenueStreamStackedArea.code,
  },
  {
    title: "Revenue Stream Composition",
    subtitle: "AG style showing how revenue sources evolve over time",
    style: "AG" as const,
    chart: <DefaultAgStackedAreaChart.Component />,
    height: 360,
    code: DefaultAgStackedAreaChart.code,
  },
  {
    title: "Resource Allocation per Sprint",
    subtitle: "AG style team capacity distribution across development, QA, design, and DevOps",
    style: "AG" as const,
    chart: <ResourceAllocationStackedArea.Component />,
    featured: true,
    height: 360,
    code: ResourceAllocationStackedArea.code,
  },
  {
    title: "Energy Generation Mix",
    subtitle: "Monthly power output from solar, wind, gas, and nuclear sources",
    style: "Toast" as const,
    chart: <EnergyMixToastStackedArea.Component />,
    featured: true,
    height: 360,
    code: EnergyMixToastStackedArea.code,
  },
  {
    title: "App Sessions by Platform",
    subtitle: "iOS, Android, and web session trends over 12 months",
    style: "Toast" as const,
    chart: <AppUsageToastStackedArea.Component />,
    height: 360,
    code: AppUsageToastStackedArea.code,
  },
  {
    title: "Support Ticket Trends",
    subtitle: "Bug reports, feature requests, questions, and billing tickets over time",
    style: "Toast" as const,
    chart: <SupportTicketsToastStackedArea.Component />,
    height: 360,
    code: SupportTicketsToastStackedArea.code,
  },
  {
    title: "Cloud Infrastructure Costs",
    subtitle: "Monthly spend across compute, storage, network, and database services",
    style: "AG" as const,
    chart: <CloudCostAgStackedArea.Component />,
    featured: true,
    height: 360,
    code: CloudCostAgStackedArea.code,
  },
  {
    title: "Team Velocity by Squad",
    subtitle: "Frontend, backend, and mobile story points across 10 sprints",
    style: "AG" as const,
    chart: <TeamVelocityAgStackedArea.Component />,
    height: 360,
    code: TeamVelocityAgStackedArea.code,
  },
  {
    title: "Browser Market Share",
    subtitle: "Chrome, Safari, Firefox, and Edge share evolving over 12 months",
    style: "AG" as const,
    chart: <MarketShareAgStackedArea.Component />,
    height: 360,
    code: MarketShareAgStackedArea.code,
  },
  {
    title: "Acquisition Channels",
    subtitle: "Organic, paid, and referral traffic with right-side legend layout",
    style: "Toast" as const,
    chart: <AcquisitionChannelsToast.Component />,
    height: 360,
    code: AcquisitionChannelsToast.code,
  },
  {
    title: "Revenue Streams (Minimal)",
    subtitle: "Clean minimal SaaS, services, and licensing revenue over 6 quarters",
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
