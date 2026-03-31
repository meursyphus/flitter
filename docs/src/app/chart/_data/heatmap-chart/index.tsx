import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  DefaultHeatmapToast,
  BasicHeatmapToast,
  ServerLoadToast,
  CorrelationMatrixToast,
  GithubActivityToast,
  SalesByRegionToast,
  WebsiteClicksToast,
  ClassroomAttendanceToast,
  EnergyUsageToast,
  SkillMatrixToast,
  CustomerJourneyToast,
  ActivityCalendarToast,
} from "./toast/examples.generated";
import {
  BasicHeatmapAg,
  ServerLoadAg,
  CorrelationMatrixAg,
  GithubActivityAg,
  SalesByRegionAg,
  ServerLoadMonitorAg,
} from "./ag/examples.generated";
import { advancedPage } from "./advanced";

const showcaseExamples: ShowcaseExample[] = [
  {
    description: "Basic heatmap with default styling — no custom overrides.",
    style: "Toast" as const,
    chart: <DefaultHeatmapToast.Component />,
    featured: true,
    height: 360,
    code: DefaultHeatmapToast.code,
  },
  {
    description: "custom.segment — rounded cells with conditional temperature labels that appear only above 15°.",
    style: "Toast" as const,
    chart: <BasicHeatmapToast.Component />,
    height: 360,
    code: BasicHeatmapToast.code,
  },
  {
    title: "Server Load Monitor",
    subtitle: "CPU utilization by hour of day across a full week",
    description: "Dark-theme dashboard with percentage labels and three-tier color coding (blue/amber/red)",
    style: "AG" as const,
    chart: <ServerLoadAg.Component />,
    height: 360,
    code: ServerLoadAg.code,
  },
  {
    title: "Correlation Matrix",
    subtitle: "Feature correlation across 6 web analytics metrics",
    description: "Diagonal cells highlighted with blue border, diverging red/blue for negative/positive, formatted as decimals",
    style: "Toast" as const,
    chart: <CorrelationMatrixToast.Component />,
    height: 360,
    code: CorrelationMatrixToast.code,
  },
  {
    title: "Contribution Activity",
    subtitle: "GitHub-style sparse activity data over 12 months",
    description: "Abbreviated quarter-start x-axis labels with bold styling for Q1/Q4/Q7/Q10",
    style: "AG" as const,
    chart: <GithubActivityAg.Component />,
    height: 360,
    code: GithubActivityAg.code,
  },
  {
    title: "Sales by Region",
    subtitle: "Product category revenue intensity across 5 global regions",
    description: "Custom y-axis labels with country flag emojis and bold region names",
    style: "Toast" as const,
    chart: <SalesByRegionToast.Component />,
    height: 360,
    code: SalesByRegionToast.code,
  },
  {
    title: "Website Click Density",
    subtitle: "Page section clicks by time of day revealing peak engagement zones",
    description: "Hot-zone detection: cells above 40 clicks get a yellow border and bold count label",
    style: "Toast" as const,
    chart: <WebsiteClicksToast.Component />,
    height: 360,
    code: WebsiteClicksToast.code,
  },
  {
    title: "Classroom Attendance",
    subtitle: "Student attendance rates over an 8-week course",
    description: "Emoji status indicators per cell: green check, yellow dot, warning, or red X based on attendance",
    style: "Toast" as const,
    chart: <ClassroomAttendanceToast.Component />,
    height: 360,
    code: ClassroomAttendanceToast.code,
  },
  {
    title: "Home Energy Usage",
    subtitle: "Power consumption by room and time of day",
    description: "Rotated x-axis time labels with bold asterisk marking for peak-hour slots",
    style: "Toast" as const,
    chart: <EnergyUsageToast.Component />,
    height: 360,
    code: EnergyUsageToast.code,
  },
  {
    title: "Team Skill Matrix",
    subtitle: "Proficiency levels of 5 team members across 6 technologies",
    description: "Pill-shaped cells with colored borders and skill-level labels (Beginner to Expert)",
    style: "Toast" as const,
    chart: <SkillMatrixToast.Component />,
    height: 360,
    code: SkillMatrixToast.code,
  },
  {
    title: "Customer Journey Funnel",
    subtitle: "Conversion rates by acquisition channel and funnel stage",
    description: "Funnel-stage opacity fade with rounded cells and bold percentage for high-conversion cells",
    style: "Toast" as const,
    chart: <CustomerJourneyToast.Component />,
    height: 360,
    code: CustomerJourneyToast.code,
  },
  {
    title: "Activity Calendar",
    subtitle: "GitHub-style contribution calendar with weekly breakdown",
    description: "GitHub-exact 5-level green palette with rounded square cells and discrete intensity buckets",
    style: "Toast" as const,
    chart: <ActivityCalendarToast.Component />,
    height: 360,
    code: ActivityCalendarToast.code,
  },
  {
    title: "Infrastructure Dashboard",
    subtitle: "Server utilization across 6 nodes by time slot",
    description: "Dark background with alert-level borders: critical cells flash with red border and '!!' prefix",
    style: "AG" as const,
    chart: <ServerLoadMonitorAg.Component />,
    height: 360,
    code: ServerLoadMonitorAg.code,
  },
];

export const pages: ChartModule = [
  {
    slug: ["heatmap-chart"],
    title: "Heatmap Chart",
    description:
      "Spot patterns in dense data. Activity over time, correlation matrices, server load — color-code the intensity.",
    pageType: "overview",
    hasAdvanced: true,
    showcaseExamples,
    styles: [
      toastSummary("heatmap-chart", <DefaultHeatmapToast.Component />),
      agSummary("heatmap-chart", <BasicHeatmapAg.Component />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
