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
    description:
      "Formatted axis labels: x-axis shows $K currency, y-axis appends 'yrs' unit via config.axis.label.format",
    style: "Toast" as const,
    chart: <DefaultToastBubbleChart.Component />,
    featured: true,
    height: 360,
    code: DefaultToastBubbleChart.code,
  },
  {
    title: "Market Analysis by Industry",
    subtitle: "Revenue vs growth rate, bubble = market size",
    description:
      "custom.bubble with conditional glow: high-growth sectors (y > 20) get full opacity + shadow, others fade to 50%",
    style: "Toast" as const,
    chart: <MarketAnalysisToastBubble.Component />,
    featured: true,
    height: 360,
    code: MarketAnalysisToastBubble.code,
  },
  {
    title: "Global City Comparison",
    subtitle: "Cost of living vs quality of life, bubble = population",
    description:
      "custom.xAxisLabel with cost-of-living threshold coloring: red for 80+, amber for 70-79, green under 70",
    style: "Toast" as const,
    chart: <CityComparisonToastBubble.Component />,
    featured: true,
    height: 360,
    code: CityComparisonToastBubble.code,
  },
  {
    title: "Market Opportunity Map",
    subtitle: "Revenue potential vs growth rate, bubble = TAM",
    description:
      "custom.dataLabel with pill-shaped background badges showing sector names on each bubble",
    style: "Toast" as const,
    chart: <MarketOpportunityToastBubble.Component />,
    featured: true,
    height: 360,
    code: MarketOpportunityToastBubble.code,
  },
  {
    title: "Startup Funding Rounds",
    subtitle: "Funding stage vs valuation, bubble = employee count",
    description:
      "Axis format mapping: x-axis converts 1-4 to Seed/Series A/B/C, y-axis shows $M/$B currency with legend on right",
    style: "Toast" as const,
    chart: <StartupFundingToastBubble.Component />,
    height: 360,
    code: StartupFundingToastBubble.code,
  },
  {
    title: "Outlined Bubble View",
    subtitle: "Ring-style bubbles for dense overlapping datasets",
    description:
      "custom.bubble rendering outlined rings: translucent fill with solid colored border for better readability in dense clusters",
    style: "Toast" as const,
    chart: <SmallBubblestoastBubbleChart.Component />,
    height: 360,
    code: SmallBubblestoastBubbleChart.code,
  },
  {
    title: "Pill Legend with Full Opacity",
    subtitle: "Solid fill for maximum visual impact",
    description:
      "custom.legend with tinted pill-shaped containers: each legend item gets a colored background chip matching its series",
    style: "Toast" as const,
    chart: <HighOpacityToastBubbleChart.Component />,
    height: 360,
    code: HighOpacityToastBubbleChart.code,
  },
  {
    title: "Tech Stack Landscape",
    subtitle: "Adoption vs satisfaction, bubble = job openings",
    description:
      "custom.xAxisLabel with inline micro-bar indicators: green/amber/gray bars show adoption level next to percentage text",
    style: "AG" as const,
    chart: <TechStackAgBubble.Component />,
    featured: true,
    height: 360,
    code: TechStackAgBubble.code,
  },
  {
    title: "Dark Neon Analysis",
    subtitle: "Quarterly metrics on dark canvas with neon glow",
    description:
      "custom.bubble with double-layer neon glow effect: two box-shadows per bubble create a bloom on the #0f172a dark background",
    style: "AG" as const,
    chart: <DarkAnalysisAgBubble.Component />,
    featured: true,
    height: 360,
    code: DarkAnalysisAgBubble.code,
  },
  {
    title: "Investment Portfolio",
    subtitle: "Risk vs return, bubble = investment size",
    description:
      "Axis label format: x-axis prefixes 'Risk' to scores, y-axis appends '%' for return rates, with subtitle context",
    style: "AG" as const,
    chart: <ProjectPortfolioAgBubble.Component />,
    height: 360,
    code: ProjectPortfolioAgBubble.code,
  },
  {
    title: "Health Metrics by Age Group",
    subtitle: "BMI vs blood pressure, bubble = group size",
    description:
      "custom.yAxisLabel with medical thresholds: 140+ shows bold red 'High', 130-139 amber 'Elevated', below green",
    style: "AG" as const,
    chart: <HealthMetricsAgBubble.Component />,
    height: 360,
    code: HealthMetricsAgBubble.code,
  },
  {
    title: "World Development Overview",
    subtitle: "AG style with title, subtitle, and formatted axes",
    description:
      "config.subtitle enabled plus config.axis.label.format: GDP as $K on x-axis, life expectancy as 'yrs' on y-axis",
    style: "AG" as const,
    chart: <DefaultAgBubbleChart.Component />,
    height: 360,
    code: DefaultAgBubbleChart.code,
  },
  {
    title: "Legend with Count Badges",
    subtitle: "AG style with constrained bubble sizes",
    description:
      "custom.legend with data-aware count badges: each legend item shows a tinted pill with the number of data points in that series",
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
