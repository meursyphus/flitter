import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  DefaultToastScatterChart,
  FilledToastScatterChart,
  LargeToastScatterChart,
  SalesVsMarketingToast,
  HeightWeightToast,
  RealEstatePriceToast,
  RdInvestmentAnalysisToast,
} from "./toast/examples";
import {
  DefaultAgScatterChart,
  FilledAgScatterChart,
  PerformanceBenchmarkAg,
  StudentScoresAg,
  CustomerSatisfactionAg,
  CompactCorrelationAg,
} from "./ag/examples";
import { advancedPage } from "./advanced";

const basicCode = `import ScatterChart from "./charts/scatter-chart";
import Widget from "@flitterjs/react";

// Create chart widget
const chart = ScatterChart({
  data: {
    datasets: [
      {
        legend: "Series A",
        data: [
          { x: 10, y: 20, label: "Point 1" },
          { x: 30, y: 50, label: "Point 2" },
          { x: 50, y: 40, label: "Point 3" },
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
    subtitle: "Global development indicators by continent",
    style: "Toast" as const,
    chart: <DefaultToastScatterChart />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastScatterChart from "./charts/toast-scatter-chart";

const chart = ToastScatterChart({
  data: {
    datasets: [
      { legend: "Africa", data: [{ x: 4200, y: 70.35, label: "Morocco" }, { x: 6600, y: 72.74, label: "Algeria" }] },
      { legend: "America", data: [{ x: 31500, y: 79.96, label: "Canada" }, { x: 32100, y: 77.43, label: "US" }] },
      { legend: "Asia", data: [{ x: 29400, y: 81.04, label: "Japan" }, { x: 34200, y: 81.39, label: "Hong Kong" }] },
      { legend: "Europe", data: [{ x: 33800, y: 80.31, label: "Switzerland" }, { x: 28700, y: 78.54, label: "Germany" }] },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Sales vs Marketing Spend",
    subtitle: "Revenue correlation across 4 product lines",
    style: "Toast" as const,
    chart: <SalesVsMarketingToast />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastScatterChart from "./charts/toast-scatter-chart";

const chart = ToastScatterChart({
  data: {
    datasets: [
      { legend: "Electronics", data: [
        { x: 12, y: 85, label: "Q1" }, { x: 18, y: 120, label: "Q2" },
        { x: 25, y: 155, label: "Q3" }, { x: 30, y: 190, label: "Q4" },
      ]},
      { legend: "Apparel", data: [
        { x: 8, y: 45, label: "Q1" }, { x: 15, y: 78, label: "Q2" },
        { x: 20, y: 95, label: "Q3" }, { x: 28, y: 130, label: "Q4" },
      ]},
      { legend: "Food & Beverage", data: [
        { x: 5, y: 60, label: "Q1" }, { x: 10, y: 90, label: "Q2" },
        { x: 14, y: 105, label: "Q3" }, { x: 18, y: 125, label: "Q4" },
      ]},
    ],
  },
  config: {
    scatter: { fill: true, size: 10, strokeWidth: 0 },
    colors: ["#3b82f6", "#f97316", "#8b5cf6", "#10b981"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Height vs Weight Distribution",
    subtitle: "Male and Female biometric clusters",
    style: "Toast" as const,
    chart: <HeightWeightToast />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastScatterChart from "./charts/toast-scatter-chart";

const chart = ToastScatterChart({
  data: {
    datasets: [
      { legend: "Male", data: [
        { x: 175, y: 80, label: "M1" }, { x: 180, y: 85, label: "M2" },
        { x: 183, y: 92, label: "M3" }, { x: 190, y: 100, label: "M4" },
      ]},
      { legend: "Female", data: [
        { x: 160, y: 55, label: "F1" }, { x: 165, y: 60, label: "F2" },
        { x: 170, y: 65, label: "F3" }, { x: 158, y: 52, label: "F4" },
      ]},
    ],
  },
  config: {
    scatter: { size: 8, strokeWidth: 2 },
    colors: ["#3b82f6", "#ec4899"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Real Estate Pricing",
    subtitle: "Price vs square footage across 3 neighborhoods",
    style: "Toast" as const,
    chart: <RealEstatePriceToast />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastScatterChart from "./charts/toast-scatter-chart";

const chart = ToastScatterChart({
  data: {
    datasets: [
      { legend: "Downtown", data: [
        { x: 850, y: 420000, label: "Apt A" }, { x: 1400, y: 720000, label: "Condo C" },
        { x: 2200, y: 1150000, label: "Penthouse E" },
      ]},
      { legend: "Suburbs", data: [
        { x: 1600, y: 350000, label: "House B" }, { x: 2500, y: 510000, label: "House D" },
        { x: 3000, y: 620000, label: "House E" },
      ]},
      { legend: "Waterfront", data: [
        { x: 2000, y: 890000, label: "Villa B" }, { x: 3500, y: 1500000, label: "Estate D" },
      ]},
    ],
  },
  config: {
    scatter: { fill: true, size: 12, strokeWidth: 1 },
    colors: ["#059669", "#d97706", "#7c3aed"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Filled Data Points",
    subtitle: "Solid markers for high-density scatter plots",
    style: "Toast" as const,
    chart: <FilledToastScatterChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastScatterChart from "./charts/toast-scatter-chart";

const chart = ToastScatterChart({
  data: { /* ... continental GDP data */ },
  config: {
    scatter: { fill: true, size: 8 },
    colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Large Markers",
    subtitle: "Emphasize key data points with larger scatter dots",
    style: "Toast" as const,
    chart: <LargeToastScatterChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastScatterChart from "./charts/toast-scatter-chart";

const chart = ToastScatterChart({
  data: { /* ... continental GDP data */ },
  config: {
    scatter: { size: 16, strokeWidth: 3 },
    colors: ["#0d9488", "#d97706", "#dc2626", "#6366f1"],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "R&D Investment Analysis",
    subtitle: "Research spending vs patent output across industries",
    style: "Toast" as const,
    chart: <RdInvestmentAnalysisToast />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ToastScatterChart from "./charts/toast-scatter-chart";

const chart = ToastScatterChart({
  data: {
    datasets: [
      { legend: "Pharmaceuticals", data: [
        { x: 4500, y: 128, label: "Pfizer" }, { x: 6200, y: 195, label: "Roche" },
        { x: 8100, y: 248, label: "J&J" },
      ]},
      { legend: "Tech", data: [
        { x: 12000, y: 385, label: "Alphabet" }, { x: 15000, y: 510, label: "Microsoft" },
        { x: 18000, y: 620, label: "Amazon" },
      ]},
      { legend: "Automotive", data: [
        { x: 5800, y: 88, label: "Toyota" }, { x: 7200, y: 112, label: "VW" },
        { x: 9400, y: 156, label: "Tesla" },
      ]},
    ],
  },
  config: {
    title: { text: "R&D vs Patents", visible: true },
    scatter: { fill: true, size: 10, strokeWidth: 1 },
    colors: ["#2563eb", "#dc2626", "#059669"],
    axis: {
      x: { label: { format: (v) => "$" + (v / 1000).toFixed(0) + "M" } },
      y: { label: { format: (v) => v + " patents" } },
    },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Performance Benchmark",
    subtitle: "Latency vs throughput for 3 backend systems",
    style: "AG" as const,
    chart: <PerformanceBenchmarkAg />,
    featured: true,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ScatterChart from "./charts/scatter-chart";

const chart = ScatterChart({
  data: {
    datasets: [
      { legend: "Node.js", data: [
        { x: 12, y: 8500, label: "GET /api" }, { x: 18, y: 7200, label: "POST /data" },
        { x: 8, y: 9800, label: "GET /health" },
      ]},
      { legend: "Go", data: [
        { x: 5, y: 15000, label: "GET /api" }, { x: 8, y: 13500, label: "POST /data" },
        { x: 3, y: 18000, label: "GET /health" },
      ]},
      { legend: "Python", data: [
        { x: 45, y: 3200, label: "GET /api" }, { x: 60, y: 2800, label: "POST /data" },
        { x: 30, y: 4000, label: "GET /health" },
      ]},
    ],
  },
  config: {
    scatter: { size: 12, strokeWidth: 3 },
    colors: {
      fills: ["#ef4444", "#3b82f6", "#10b981"],
      strokes: ["#ef4444", "#3b82f6", "#10b981"],
    },
    grid: { dash: [4, 4] },
    background: "#fafafa",
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Student Test Scores",
    subtitle: "Math vs Science performance across 3 classes",
    style: "AG" as const,
    chart: <StudentScoresAg />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ScatterChart from "./charts/scatter-chart";

const chart = ScatterChart({
  data: {
    datasets: [
      { legend: "Class A", data: [
        { x: 85, y: 78, label: "S1" }, { x: 92, y: 88, label: "S2" },
        { x: 76, y: 82, label: "S3" }, { x: 95, y: 91, label: "S4" },
      ]},
      { legend: "Class B", data: [
        { x: 70, y: 85, label: "S1" }, { x: 88, y: 92, label: "S2" },
        { x: 90, y: 95, label: "S3" },
      ]},
      { legend: "Class C", data: [
        { x: 60, y: 55, label: "S1" }, { x: 82, y: 78, label: "S2" },
        { x: 90, y: 85, label: "S3" },
      ]},
    ],
  },
  config: {
    scatter: { size: 9 },
    colors: {
      fills: ["#f59e0b", "#8b5cf6", "#06b6d4"],
      strokes: ["#f59e0b", "#8b5cf6", "#06b6d4"],
    },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Customer Satisfaction",
    subtitle: "Price vs satisfaction rating by product category",
    style: "AG" as const,
    chart: <CustomerSatisfactionAg />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ScatterChart from "./charts/scatter-chart";

const chart = ScatterChart({
  data: {
    datasets: [
      { legend: "Software", data: [
        { x: 49, y: 4.2, label: "Notion" }, { x: 99, y: 4.5, label: "Figma" },
        { x: 199, y: 4.7, label: "Salesforce" },
      ]},
      { legend: "Hardware", data: [
        { x: 999, y: 4.3, label: "MacBook" }, { x: 1299, y: 4.6, label: "iPhone" },
      ]},
      { legend: "Services", data: [
        { x: 15, y: 4.1, label: "Netflix" }, { x: 10, y: 3.5, label: "Spotify" },
      ]},
    ],
  },
  config: {
    scatter: { size: 11, strokeWidth: 2 },
    colors: {
      fills: ["#0d9488", "#e11d48", "#2563eb", "#d97706"],
      strokes: ["#0d9488", "#e11d48", "#2563eb", "#d97706"],
    },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Continental Overview",
    subtitle: "AG style with clean data point rendering",
    style: "AG" as const,
    chart: <DefaultAgScatterChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ScatterChart from "./charts/scatter-chart";

const chart = ScatterChart({
  data: {
    datasets: [
      { legend: "Africa", data: [{ x: 4200, y: 70.35, label: "Morocco" }] },
      { legend: "America", data: [{ x: 32100, y: 77.43, label: "US" }] },
      { legend: "Asia", data: [{ x: 29400, y: 81.04, label: "Japan" }] },
      { legend: "Europe", data: [{ x: 33800, y: 80.31, label: "Switzerland" }] },
      { legend: "Oceania", data: [{ x: 30700, y: 80.26, label: "Australia" }] },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Sized Data Points",
    subtitle: "Larger markers for presentation-ready charts",
    style: "AG" as const,
    chart: <FilledAgScatterChart />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ScatterChart from "./charts/scatter-chart";

const chart = ScatterChart({
  data: { /* ... continental GDP data */ },
  config: {
    scatter: { size: 8 },
    colors: {
      fills: ["#6366f1", "#ec4899", "#10b981"],
      strokes: ["#6366f1", "#ec4899", "#10b981"],
    },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  {
    title: "Compact Correlation View",
    subtitle: "Marketing channel metrics with clean analytical style",
    style: "AG" as const,
    chart: <CompactCorrelationAg />,
    height: 360,
    code: `import Widget from "@flitterjs/react";
import ScatterChart from "./charts/scatter-chart";

const chart = ScatterChart({
  data: {
    datasets: [
      { legend: "Engagement", data: [
        { x: 2.1, y: 34, label: "Email" }, { x: 4.8, y: 67, label: "Social" },
        { x: 6.5, y: 82, label: "Webinar" },
      ]},
      { legend: "Conversion", data: [
        { x: 1.5, y: 12, label: "Email" }, { x: 3.6, y: 29, label: "Social" },
        { x: 5.2, y: 41, label: "Webinar" },
      ]},
      { legend: "Retention", data: [
        { x: 3.0, y: 58, label: "Email" }, { x: 4.1, y: 63, label: "Blog" },
        { x: 5.8, y: 78, label: "Webinar" },
      ]},
    ],
  },
  config: {
    scatter: { size: 8, strokeWidth: 2 },
    colors: {
      fills: ["#6366f1", "#f43f5e", "#10b981"],
      strokes: ["#6366f1", "#f43f5e", "#10b981"],
    },
    grid: { dash: [3, 3] },
    legend: { position: "right-top" },
    background: "#fafafa",
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
];

export const pages: ChartModule = [
  {
    slug: ["scatter-chart"],
    title: "Scatter Chart",
    description:
      "Explore relationships between two variables. Correlation, clustering, outlier detection — plot the data and see what emerges.",
    pageType: "overview",
    quickStartCode: basicCode,
    hasAdvanced: true,
    showcaseExamples,
    styles: [
      toastSummary("scatter-chart", <DefaultToastScatterChart />),
      agSummary("scatter-chart", <DefaultAgScatterChart />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
