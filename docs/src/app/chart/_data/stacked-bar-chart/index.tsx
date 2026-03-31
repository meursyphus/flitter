import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  RegionalRevenueToast,
  HorizontalCategoryToast,
  ProductPLMixToast,
  MarketingChannelToast,
  BudgetAllocationToast,
  EnergySourceToast,
  EmployeeDistributionToast,
  DepartmentBudgetToast,
} from "./toast/examples.generated";
import {
  RegionalSalesAg,
  DepartmentHeadcountAg,
  VolatileQuarterlyAg,
  RevenueByProductAg,
  SurveyResponsesAg,
  SprintEffortAg,
  ProjectHoursAg,
} from "./ag/examples.generated";
import { advancedPage } from "./advanced";

const basicCode = `import StackedBarChart from "./charts/stacked-bar-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = StackedBarChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      { legend: "Product A", values: [40, 65, 50, 80] },
      { legend: "Product B", values: [30, 45, 35, 60] },
    ],
  },
});

// Render with React
<Widget widget={chart} width={600} height={400} />`;

const showcaseExamples: ShowcaseExample[] = [
  {
    title: "Regional Revenue Breakdown",
    subtitle: "Monthly revenue stacked by North America, Europe, and Asia Pacific",
    description: "custom.bar — rounded corners only on the topmost segment for a polished stacked look",
    style: "Toast" as const,
    chart: <RegionalRevenueToast.Component />,
    featured: true,
    height: 360,
    code: RegionalRevenueToast.code,
  },
  {
    title: "Department Headcount",
    subtitle: "Horizontal stacked bars with department code prefixes",
    description: "custom.yAxisLabel — monospace department codes prepended to each label",
    style: "AG" as const,
    chart: <DepartmentHeadcountAg.Component />,
    height: 380,
    code: DepartmentHeadcountAg.code,
  },
  {
    title: "Product P&L Mix",
    subtitle: "Positive and negative values stacked by product line",
    description: "custom.yAxisLabel — zero-line highlighted in bold red, negative values dimmed",
    style: "Toast" as const,
    chart: <ProductPLMixToast.Component />,
    height: 360,
    code: ProductPLMixToast.code,
  },
  {
    title: "Regional Sales Composition",
    subtitle: "Teal monochrome theme with tinted background",
    description: "config — custom background color, dashed grid lines, and rounded bar corners",
    style: "AG" as const,
    chart: <RegionalSalesAg.Component />,
    height: 360,
    code: RegionalSalesAg.code,
  },
  {
    title: "Office Revenue by Region",
    subtitle: "Horizontal bars ranked by total revenue across offices",
    description: "custom.yAxisLabel — numbered ranking with gold/silver/bronze highlight for top 3",
    style: "Toast" as const,
    chart: <HorizontalCategoryToast.Component />,
    height: 380,
    code: HorizontalCategoryToast.code,
  },
  {
    title: "Volatile Quarterly Mix",
    subtitle: "Conditional bar coloring for positive vs negative segments",
    description: "custom.bar — green for gains, translucent red for losses per segment",
    style: "AG" as const,
    chart: <VolatileQuarterlyAg.Component />,
    height: 360,
    code: VolatileQuarterlyAg.code,
  },
  {
    title: "Marketing Channel Conversions",
    subtitle: "SEO, paid ads, social, and email conversions by month",
    description: "custom.dataLabel — stack totals displayed above the topmost segment",
    style: "Toast" as const,
    chart: <MarketingChannelToast.Component />,
    featured: true,
    height: 360,
    code: MarketingChannelToast.code,
  },
  {
    title: "Budget Allocation by Department",
    subtitle: "Quarterly budget breakdown across Engineering, Marketing, Sales, and Ops",
    description: "custom.title — decorated title card with blue background and subtitle text",
    style: "Toast" as const,
    chart: <BudgetAllocationToast.Component />,
    height: 380,
    code: BudgetAllocationToast.code,
  },
  {
    title: "Department Budget Breakdown",
    subtitle: "Salaries, tools, training, and travel spend across 5 departments",
    description: "custom.xAxisLabel — angled department names with bold purple styling",
    style: "Toast" as const,
    chart: <DepartmentBudgetToast.Component />,
    featured: true,
    height: 360,
    code: DepartmentBudgetToast.code,
  },
  {
    title: "Energy Generation by Source",
    subtitle: "Monthly energy output from solar, wind, hydro, and nuclear",
    description: "config — rounded corners, right-aligned legend, and soft grid lines",
    style: "Toast" as const,
    chart: <EnergySourceToast.Component />,
    height: 360,
    code: EnergySourceToast.code,
  },
  {
    title: "Employee Distribution by Seniority",
    subtitle: "Junior, mid-level, and senior headcount across departments",
    description: "custom.bar — bars dim to translucent for departments with fewer than 100 total employees",
    style: "Toast" as const,
    chart: <EmployeeDistributionToast.Component />,
    height: 380,
    code: EmployeeDistributionToast.code,
  },
  {
    title: "Revenue by Product Line",
    subtitle: "SaaS, mobile, and API revenue growth by quarter",
    description: "config — right-top legend, rounded corners, and subtle background tint",
    style: "AG" as const,
    chart: <RevenueByProductAg.Component />,
    featured: true,
    height: 360,
    code: RevenueByProductAg.code,
  },
  {
    title: "Employee Survey Responses",
    subtitle: "Agreement levels across workplace satisfaction categories",
    description: "custom.xAxisLabel — percentage annotations below axis values, green highlight for 80%+",
    style: "AG" as const,
    chart: <SurveyResponsesAg.Component />,
    height: 380,
    code: SurveyResponsesAg.code,
  },
  {
    title: "Project Hours by Phase",
    subtitle: "Design, development, and QA hours across 5 projects",
    description: "custom.title — accent bar indicator with bold heading in a custom Row layout",
    style: "AG" as const,
    chart: <ProjectHoursAg.Component />,
    featured: true,
    height: 360,
    code: ProjectHoursAg.code,
  },
  {
    title: "Sprint Effort Breakdown",
    subtitle: "Design, development, QA, and deployment hours per sprint",
    description: "custom.dataLabel — total hours shown above each bar, red highlight when over 100h",
    style: "AG" as const,
    chart: <SprintEffortAg.Component />,
    height: 360,
    code: SprintEffortAg.code,
  },
];

export const pages: ChartModule = [
  {
    slug: ["stacked-bar-chart"],
    title: "Stacked Bar Chart",
    description:
      "Show composition within categories. Revenue breakdown by product line, workforce by department — see both the total and the parts.",
    pageType: "overview",
    quickStartCode: basicCode,
    hasAdvanced: true,
    showcaseExamples,
    styles: [
      toastSummary("stacked-bar-chart", <RegionalRevenueToast.Component />),
      agSummary("stacked-bar-chart", <RegionalSalesAg.Component />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
