import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
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
    title: "Weekly Temperature Pattern",
    subtitle: "Average temperatures by day of week across 12 months",
    style: "Toast" as const,
    chart: <BasicHeatmapToast.Component />,
    featured: true,
    height: 360,
    code: BasicHeatmapToast.code,
  },
  {
    title: "Server Load Monitor",
    subtitle: "CPU utilization by hour of day across a full week",
    style: "AG" as const,
    chart: <ServerLoadAg.Component />,
    height: 360,
    code: ServerLoadAg.code,
  },
  {
    title: "Correlation Matrix",
    subtitle: "Feature correlation across 6 web analytics metrics",
    style: "Toast" as const,
    chart: <CorrelationMatrixToast.Component />,
    height: 360,
    code: CorrelationMatrixToast.code,
  },
  {
    title: "Contribution Activity",
    subtitle: "GitHub-style sparse activity data over 12 months",
    style: "AG" as const,
    chart: <GithubActivityAg.Component />,
    height: 360,
    code: GithubActivityAg.code,
  },
  {
    title: "Sales by Region",
    subtitle: "Product category revenue intensity across 5 global regions",
    style: "Toast" as const,
    chart: <SalesByRegionToast.Component />,
    height: 360,
    code: SalesByRegionToast.code,
  },
  {
    title: "Website Click Density",
    subtitle: "Page section clicks by time of day revealing peak engagement zones",
    style: "AG" as const,
    chart: <WebsiteClicksToast.Component />,
    height: 360,
    code: WebsiteClicksToast.code,
  },
  {
    title: "Classroom Attendance",
    subtitle: "Student attendance rates over an 8-week course",
    style: "Toast" as const,
    chart: <ClassroomAttendanceToast.Component />,
    height: 360,
    code: ClassroomAttendanceToast.code,
  },
  {
    title: "Home Energy Usage",
    subtitle: "Power consumption by room and time of day",
    style: "AG" as const,
    chart: <EnergyUsageToast.Component />,
    height: 360,
    code: EnergyUsageToast.code,
  },
  {
    title: "Team Skill Matrix",
    subtitle: "Proficiency levels of 5 team members across 6 technologies",
    style: "Toast" as const,
    chart: <SkillMatrixToast.Component />,
    height: 360,
    code: SkillMatrixToast.code,
  },
  {
    title: "Customer Journey Funnel",
    subtitle: "Conversion rates by acquisition channel and funnel stage",
    style: "AG" as const,
    chart: <CustomerJourneyToast.Component />,
    height: 360,
    code: CustomerJourneyToast.code,
  },
  {
    title: "Activity Calendar",
    subtitle: "GitHub-style contribution calendar with weekly breakdown",
    style: "Toast" as const,
    chart: <ActivityCalendarToast.Component />,
    height: 360,
    code: ActivityCalendarToast.code,
  },
  {
    title: "Server Load Monitor",
    subtitle: "Infrastructure utilization across 6 servers by time slot",
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
      toastSummary("heatmap-chart", <BasicHeatmapToast.Component />),
      agSummary("heatmap-chart", <BasicHeatmapAg.Component />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
