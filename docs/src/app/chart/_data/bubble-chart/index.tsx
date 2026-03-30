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
} from "./toast/examples";
import {
  DefaultAgBubbleChart,
  SmallAgBubbleChart,
  TechStackAgBubble,
  ProjectPortfolioAgBubble,
  HealthMetricsAgBubble,
} from "./ag/examples";
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
    chart: <DefaultToastBubbleChart />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastBubbleChart from "./charts/toast-bubble-chart";

const chart = ToastBubbleChart({
  data: {
    datasets: [
      { legend: "Africa", data: [{ x: 4200, y: 70.35, value: 32209101, label: "Morocco" }] },
      { legend: "America", data: [{ x: 32100, y: 77.43, value: 89302754, label: "US" }] },
      { legend: "Asia", data: [{ x: 29400, y: 81.04, value: 52733300, label: "Japan" }] },
      { legend: "Europe", data: [{ x: 29600, y: 78.27, value: 60270708, label: "UK" }] },
      { legend: "Oceania", data: [{ x: 30700, y: 80.26, value: 5991314, label: "Australia" }] },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Market Analysis by Industry",
    subtitle: "Revenue vs growth rate, bubble = market size",
    style: "Toast" as const,
    chart: <MarketAnalysisToastBubble />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastBubbleChart from "./charts/toast-bubble-chart";

const chart = ToastBubbleChart({
  data: {
    datasets: [
      { legend: "Technology", data: [
        { x: 120, y: 18, value: 850, label: "Cloud Services" },
        { x: 85, y: 25, value: 620, label: "AI/ML" },
        { x: 200, y: 8, value: 1200, label: "Enterprise Software" },
      ]},
      { legend: "Healthcare", data: [
        { x: 90, y: 12, value: 950, label: "Pharmaceuticals" },
        { x: 60, y: 22, value: 400, label: "Biotech" },
      ]},
      { legend: "Finance", data: [
        { x: 180, y: 5, value: 1500, label: "Banking" },
        { x: 70, y: 28, value: 350, label: "Fintech" },
      ]},
      { legend: "Energy", data: [
        { x: 250, y: 3, value: 2000, label: "Oil & Gas" },
        { x: 30, y: 45, value: 180, label: "Solar" },
      ]},
    ],
  },
  config: {
    bubble: { minRadius: 8, maxRadius: 45, opacity: 0.5 },
    colors: ["#0ea5e9", "#f97316", "#8b5cf6", "#10b981"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Global City Comparison",
    subtitle: "Cost of living vs quality of life, bubble = population",
    style: "Toast" as const,
    chart: <CityComparisonToastBubble />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastBubbleChart from "./charts/toast-bubble-chart";

const chart = ToastBubbleChart({
  data: {
    datasets: [
      { legend: "North America", data: [
        { x: 82, y: 7.8, value: 8300000, label: "New York" },
        { x: 75, y: 7.5, value: 3900000, label: "Los Angeles" },
        { x: 78, y: 8.3, value: 680000, label: "San Francisco" },
      ]},
      { legend: "Europe", data: [
        { x: 88, y: 8.5, value: 9000000, label: "London" },
        { x: 76, y: 8.8, value: 2200000, label: "Paris" },
        { x: 85, y: 8.9, value: 1400000, label: "Zurich" },
      ]},
      { legend: "Asia Pacific", data: [
        { x: 95, y: 7.6, value: 13960000, label: "Tokyo" },
        { x: 90, y: 8.0, value: 5450000, label: "Singapore" },
      ]},
    ],
  },
  config: {
    bubble: { minRadius: 10, maxRadius: 55, opacity: 0.65 },
    colors: ["#6366f1", "#ec4899", "#06b6d4"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Startup Funding Rounds",
    subtitle: "Funding stage vs valuation, bubble = employee count",
    style: "Toast" as const,
    chart: <StartupFundingToastBubble />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastBubbleChart from "./charts/toast-bubble-chart";

const chart = ToastBubbleChart({
  data: {
    datasets: [
      { legend: "SaaS", data: [
        { x: 1, y: 8, value: 25, label: "Seed - TaskFlow" },
        { x: 2, y: 45, value: 80, label: "Series A - DataSync" },
        { x: 3, y: 180, value: 250, label: "Series B - CloudPeak" },
      ]},
      { legend: "Biotech", data: [
        { x: 1, y: 12, value: 15, label: "Seed - GeneCure" },
        { x: 2, y: 80, value: 45, label: "Series A - BioNova" },
        { x: 3, y: 350, value: 120, label: "Series B - MediGen" },
      ]},
      { legend: "Clean Energy", data: [
        { x: 1, y: 5, value: 10, label: "Seed - SolarFlux" },
        { x: 2, y: 30, value: 55, label: "Series A - WindCore" },
      ]},
    ],
  },
  config: {
    bubble: { minRadius: 6, maxRadius: 40, opacity: 0.45 },
    colors: ["#10b981", "#f59e0b", "#ef4444"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Compact Bubble View",
    subtitle: "Smaller radii for dense datasets with many overlapping points",
    style: "Toast" as const,
    chart: <SmallBubblestoastBubbleChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastBubbleChart from "./charts/toast-bubble-chart";

const chart = ToastBubbleChart({
  data: { /* ... continental population data */ },
  config: {
    bubble: { minRadius: 3, maxRadius: 25, opacity: 0.8 },
    colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Full Opacity Bubbles",
    subtitle: "Solid fill for maximum visual impact",
    style: "Toast" as const,
    chart: <HighOpacityToastBubbleChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastBubbleChart from "./charts/toast-bubble-chart";

const chart = ToastBubbleChart({
  data: { /* ... continental population data */ },
  config: {
    bubble: { opacity: 1.0 },
    colors: ["#dc2626", "#2563eb", "#059669", "#7c3aed", "#d97706"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Tech Stack Landscape",
    subtitle: "Adoption vs satisfaction, bubble = job openings",
    style: "AG" as const,
    chart: <TechStackAgBubble />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import BubbleChart from "./charts/bubble-chart";

const chart = BubbleChart({
  data: {
    datasets: [
      { legend: "Frontend", data: [
        { x: 85, y: 4.5, value: 45000, label: "React" },
        { x: 72, y: 4.7, value: 28000, label: "Vue" },
        { x: 60, y: 4.6, value: 22000, label: "Svelte" },
      ]},
      { legend: "Backend", data: [
        { x: 78, y: 4.3, value: 52000, label: "Node.js" },
        { x: 55, y: 4.4, value: 38000, label: "Go" },
        { x: 65, y: 4.6, value: 42000, label: "Python" },
      ]},
      { legend: "Database", data: [
        { x: 90, y: 4.0, value: 60000, label: "PostgreSQL" },
        { x: 70, y: 4.2, value: 35000, label: "MongoDB" },
      ]},
    ],
  },
  config: {
    bubble: { minRadius: 5, maxRadius: 30, opacity: 0.6 },
    colors: {
      fills: ["#3b82f6", "#10b981", "#f59e0b"],
      strokes: ["#3b82f6", "#10b981", "#f59e0b"],
    },
    grid: { dash: [4, 4] },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Investment Portfolio",
    subtitle: "Risk vs return, bubble = investment size",
    style: "AG" as const,
    chart: <ProjectPortfolioAgBubble />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import BubbleChart from "./charts/bubble-chart";

const chart = BubbleChart({
  data: {
    datasets: [
      { legend: "Conservative", data: [
        { x: 2, y: 5, value: 500000, label: "Gov Bonds" },
        { x: 3, y: 6, value: 300000, label: "Blue Chip" },
      ]},
      { legend: "Balanced", data: [
        { x: 5, y: 10, value: 400000, label: "Index Fund" },
        { x: 6, y: 12, value: 350000, label: "REITs" },
      ]},
      { legend: "Aggressive", data: [
        { x: 9, y: 22, value: 150000, label: "Tech Startup" },
        { x: 10, y: 25, value: 100000, label: "Crypto Fund" },
      ]},
    ],
  },
  config: {
    bubble: { minRadius: 4, maxRadius: 35, opacity: 0.55 },
    colors: {
      fills: ["#059669", "#dc2626", "#6366f1"],
      strokes: ["#059669", "#dc2626", "#6366f1"],
    },
    background: "#f8fafc",
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Health Metrics by Age Group",
    subtitle: "BMI vs blood pressure, bubble = group size",
    style: "AG" as const,
    chart: <HealthMetricsAgBubble />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import BubbleChart from "./charts/bubble-chart";

const chart = BubbleChart({
  data: {
    datasets: [
      { legend: "Age 20-35", data: [
        { x: 22, y: 118, value: 15000, label: "Active" },
        { x: 25, y: 125, value: 22000, label: "Moderate" },
        { x: 28, y: 130, value: 8000, label: "Sedentary" },
      ]},
      { legend: "Age 36-50", data: [
        { x: 27, y: 132, value: 25000, label: "Moderate" },
        { x: 31, y: 140, value: 18000, label: "Sedentary" },
      ]},
      { legend: "Age 51-65", data: [
        { x: 30, y: 138, value: 20000, label: "Moderate" },
        { x: 34, y: 148, value: 15000, label: "Sedentary" },
      ]},
    ],
  },
  config: {
    bubble: { opacity: 0.5, minRadius: 8, maxRadius: 28 },
    colors: {
      fills: ["#ef4444", "#3b82f6", "#10b981"],
      strokes: ["#ef4444", "#3b82f6", "#10b981"],
    },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "World Development Overview",
    subtitle: "AG style with default bubble sizing",
    style: "AG" as const,
    chart: <DefaultAgBubbleChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import BubbleChart from "./charts/bubble-chart";

const chart = BubbleChart({
  data: {
    datasets: [
      { legend: "Africa", data: [{ x: 4200, y: 70.35, value: 32209101, label: "Morocco" }] },
      { legend: "America", data: [{ x: 32100, y: 77.43, value: 89302754, label: "US" }] },
      { legend: "Asia", data: [{ x: 29400, y: 81.04, value: 52733300, label: "Japan" }] },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Tight Radius Range",
    subtitle: "AG style with constrained bubble sizes",
    style: "AG" as const,
    chart: <SmallAgBubbleChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import BubbleChart from "./charts/bubble-chart";

const chart = BubbleChart({
  data: { /* ... continental population data */ },
  config: {
    bubble: { minRadius: 2, maxRadius: 20, opacity: 0.8 },
    colors: {
      fills: ["#7c3aed", "#06b6d4", "#f97316"],
      strokes: ["#7c3aed", "#06b6d4", "#f97316"],
    },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
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
      toastSummary("bubble-chart", <DefaultToastBubbleChart />),
      agSummary("bubble-chart", <DefaultAgBubbleChart />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
