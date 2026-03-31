import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  DefaultToastBubbleChart,
  SmallBubblestoastBubbleChart,
  HighOpacityToastBubbleChart,
  MarketAnalysisToastBubble,
  CityComparisonToastBubble,
  StartupFundingToastBubble,
  MarketOpportunityToastBubble,
} from "./toast/examples.generated";
import {
  DefaultAgBubbleChart,
  SmallAgBubbleChart,
  TechStackAgBubble,
  ProjectPortfolioAgBubble,
  HealthMetricsAgBubble,
  DarkAnalysisAgBubble,
} from "./ag/examples.generated";
import { advancedPage } from "./advanced";

const basicCode = `import BubbleChart from "./charts/bubble-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = BubbleChart({
  data: {
    datasets: [
      {
        legend: "Series A",
        data: [
          { x: 10, y: 20, value: 100, label: "Point 1" },
          { x: 30, y: 50, value: 300, label: "Point 2" },
          { x: 50, y: 40, value: 200, label: "Point 3" },
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
    subtitle: "Population as bubble size across 5 continents",
    style: "Toast" as const,
    chart: <DefaultToastBubbleChart.Component />,
    featured: true,
    height: 360,
    code: DefaultToastBubbleChart.code,
  },
  {
    title: "Market Analysis by Industry",
    subtitle: "Revenue vs growth rate, bubble = market size",
    style: "Toast" as const,
    chart: <MarketAnalysisToastBubble.Component />,
    featured: true,
    height: 360,
    code: MarketAnalysisToastBubble.code,
  },
  {
    title: "Global City Comparison",
    subtitle: "Cost of living vs quality of life, bubble = population",
    style: "Toast" as const,
    chart: <CityComparisonToastBubble.Component />,
    featured: true,
    height: 360,
    code: CityComparisonToastBubble.code,
  },
  {
    title: "Market Opportunity Map",
    subtitle: "Revenue potential vs growth rate, bubble = TAM",
    style: "Toast" as const,
    chart: <MarketOpportunityToastBubble.Component />,
    featured: true,
    height: 360,
    code: MarketOpportunityToastBubble.code,
  },
  {
    title: "Startup Funding Rounds",
    subtitle: "Funding stage vs valuation, bubble = employee count",
    style: "Toast" as const,
    chart: <StartupFundingToastBubble.Component />,
    height: 360,
    code: StartupFundingToastBubble.code,
  },
  {
    title: "Compact Bubble View",
    subtitle: "Smaller radii for dense datasets with many overlapping points",
    style: "Toast" as const,
    chart: <SmallBubblestoastBubbleChart.Component />,
    height: 360,
    code: SmallBubblestoastBubbleChart.code,
  },
  {
    title: "Full Opacity Bubbles",
    subtitle: "Solid fill for maximum visual impact",
    style: "Toast" as const,
    chart: <HighOpacityToastBubbleChart.Component />,
    height: 360,
    code: HighOpacityToastBubbleChart.code,
  },
  {
    title: "Tech Stack Landscape",
    subtitle: "Adoption vs satisfaction, bubble = job openings",
    style: "AG" as const,
    chart: <TechStackAgBubble.Component />,
    featured: true,
    height: 360,
    code: TechStackAgBubble.code,
  },
  {
    title: "Dark Analysis Dashboard",
    subtitle: "Quarterly metrics on a dark canvas for analyst workflows",
    style: "AG" as const,
    chart: <DarkAnalysisAgBubble.Component />,
    featured: true,
    height: 360,
    code: DarkAnalysisAgBubble.code,
  },
  {
    title: "Investment Portfolio",
    subtitle: "Risk vs return, bubble = investment size",
    style: "AG" as const,
    chart: <ProjectPortfolioAgBubble.Component />,
    height: 360,
    code: ProjectPortfolioAgBubble.code,
  },
  {
    title: "Health Metrics by Age Group",
    subtitle: "BMI vs blood pressure, bubble = group size",
    style: "AG" as const,
    chart: <HealthMetricsAgBubble.Component />,
    height: 360,
    code: HealthMetricsAgBubble.code,
  },
  {
    title: "World Development Overview",
    subtitle: "AG style with default bubble sizing",
    style: "AG" as const,
    chart: <DefaultAgBubbleChart.Component />,
    height: 360,
    code: DefaultAgBubbleChart.code,
  },
  {
    title: "Tight Radius Range",
    subtitle: "AG style with constrained bubble sizes",
    style: "AG" as const,
    chart: <SmallAgBubbleChart.Component />,
    height: 360,
    code: SmallAgBubbleChart.code,
  },
];

export const pages: ChartModule = [
  {
    slug: ["bubble-chart"],
    title: "Bubble Chart",
    description:
      "Scatter plots with a third dimension. Add size to show magnitude — GDP vs life expectancy vs population, all in one view.",
    pageType: "overview",
    quickStartCode: basicCode,
    hasAdvanced: true,
    showcaseExamples,
    styles: [
      toastSummary("bubble-chart", <DefaultToastBubbleChart.Component />),
      agSummary("bubble-chart", <DefaultAgBubbleChart.Component />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
