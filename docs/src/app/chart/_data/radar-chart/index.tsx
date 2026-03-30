import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  BasicRadarChart,
  SkillComparisonRadarChart,
  ProductReviewRadarChart,
  TeamPerformanceRadarChart,
  AthleteProfileRadar,
  RestaurantRatingRadar,
  CarComparisonRadar,
  CompanyCultureRadar,
  NutritionProfileRadar,
  FrameworkComparisonRadar,
} from "./toast/examples";
import {
  BasicAgRadarChart,
  SkillComparisonAgRadar,
  ProductReviewAgRadar,
  TeamPerformanceAgRadar,
  AthleteProfileAgRadar,
} from "./ag/examples";
import { advancedPage } from "./advanced";

const showcaseExamples: ShowcaseExample[] = [
  // Featured hero — Toast
  {
    title: "Developer Skill Profile",
    subtitle: "Compare senior, junior, and full-stack skill levels across 8 dimensions",
    style: "Toast" as const,
    chart: <BasicRadarChart />,
    featured: true,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import ToastRadarChart from "./charts/toast-radar-chart";

const chart = ToastRadarChart({
  data: {
    labels: ["JavaScript", "TypeScript", "React", "Node.js", "CSS", "GraphQL", "Testing", "DevOps"],
    datasets: [
      { legend: "Senior Dev", values: [95, 90, 85, 80, 70, 75, 80, 65] },
      { legend: "Junior Dev", values: [70, 50, 60, 40, 65, 30, 35, 20] },
      { legend: "Full Stack", values: [80, 75, 70, 85, 60, 65, 70, 80] },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // AG
  {
    title: "Skill Comparison",
    subtitle: "Head-to-head comparison of two candidates across 6 soft skills",
    style: "AG" as const,
    chart: <SkillComparisonAgRadar />,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import RadarChart from "./charts/radar-chart";

const chart = RadarChart({
  data: {
    labels: ["Leadership", "Problem Solving", "Communication", "Technical", "Creativity", "Teamwork"],
    datasets: [
      { legend: "Alice", values: [90, 85, 95, 70, 80, 92] },
      { legend: "Bob", values: [75, 92, 60, 95, 65, 78] },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Toast
  {
    title: "Product Review Scores",
    subtitle: "Rate three products across price, quality, design, durability, and support",
    style: "Toast" as const,
    chart: <ProductReviewRadarChart />,
    featured: true,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import ToastRadarChart from "./charts/toast-radar-chart";

const chart = ToastRadarChart({
  data: {
    labels: ["Price", "Quality", "Design", "Durability", "Support"],
    datasets: [
      { legend: "Product A", values: [60, 90, 85, 95, 70] },
      { legend: "Product B", values: [85, 70, 75, 60, 90] },
      { legend: "Product C", values: [75, 80, 90, 80, 65] },
    ],
  },
  config: {
    colors: ["#10b981", "#f97316", "#8b5cf6"],
    radar: { fillOpacity: 0.2 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // AG
  {
    title: "Team Performance KPIs",
    subtitle: "Compare frontend, backend, and DevOps team metrics",
    style: "AG" as const,
    chart: <TeamPerformanceAgRadar />,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import RadarChart from "./charts/radar-chart";

const chart = RadarChart({
  data: {
    labels: ["Speed", "Quality", "Communication", "Innovation", "Reliability"],
    datasets: [
      { legend: "Frontend", values: [88, 82, 90, 85, 78] },
      { legend: "Backend", values: [75, 95, 72, 70, 92] },
      { legend: "DevOps", values: [80, 88, 68, 75, 98] },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Toast
  {
    title: "Athlete Profile",
    subtitle: "Physical attributes of a sprinter, marathoner, and gymnast",
    style: "Toast" as const,
    chart: <AthleteProfileRadar />,
    featured: true,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import ToastRadarChart from "./charts/toast-radar-chart";

const chart = ToastRadarChart({
  data: {
    labels: ["Speed", "Strength", "Endurance", "Agility", "Flexibility"],
    datasets: [
      { legend: "Sprinter", values: [98, 75, 50, 90, 60] },
      { legend: "Marathoner", values: [70, 55, 98, 65, 75] },
      { legend: "Gymnast", values: [72, 68, 60, 95, 98] },
    ],
  },
  config: {
    colors: ["#ef4444", "#3b82f6", "#10b981"],
    radar: { fillOpacity: 0.1, strokeWidth: 3 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // AG
  {
    title: "Product Review (AG)",
    subtitle: "AG style product comparison across 5 dimensions",
    style: "AG" as const,
    chart: <ProductReviewAgRadar />,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import RadarChart from "./charts/radar-chart";

const chart = RadarChart({
  data: {
    labels: ["Price", "Quality", "Design", "Durability", "Support"],
    datasets: [
      { legend: "Product A", values: [60, 90, 85, 95, 70] },
      { legend: "Product B", values: [85, 70, 75, 60, 90] },
      { legend: "Product C", values: [75, 80, 90, 80, 65] },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Toast
  {
    title: "Restaurant Ratings",
    subtitle: "Three dining spots compared across food, service, ambiance, value, and location",
    style: "Toast" as const,
    chart: <RestaurantRatingRadar />,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import ToastRadarChart from "./charts/toast-radar-chart";

const chart = ToastRadarChart({
  data: {
    labels: ["Food", "Service", "Ambiance", "Value", "Location"],
    datasets: [
      { legend: "Chez Marie", values: [95, 88, 92, 65, 78] },
      { legend: "Tokyo Ramen", values: [90, 72, 68, 92, 85] },
      { legend: "Burger Joint", values: [78, 80, 55, 95, 90] },
    ],
  },
  config: {
    colors: ["#d97706", "#dc2626", "#059669"],
    radar: { fillOpacity: 0.35, strokeWidth: 2 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // AG
  {
    title: "Athlete Profile (AG)",
    subtitle: "AG style physical attribute comparison",
    style: "AG" as const,
    chart: <AthleteProfileAgRadar />,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import RadarChart from "./charts/radar-chart";

const chart = RadarChart({
  data: {
    labels: ["Speed", "Strength", "Endurance", "Agility", "Flexibility"],
    datasets: [
      { legend: "Sprinter", values: [98, 75, 50, 90, 60] },
      { legend: "Marathoner", values: [70, 55, 98, 65, 75] },
      { legend: "Gymnast", values: [72, 68, 60, 95, 98] },
    ],
  },
  config: {},
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Toast
  {
    title: "Car Comparison",
    subtitle: "Sedan vs SUV vs EV across 5 buying criteria",
    style: "Toast" as const,
    chart: <CarComparisonRadar />,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import ToastRadarChart from "./charts/toast-radar-chart";

const chart = ToastRadarChart({
  data: {
    labels: ["Performance", "Comfort", "Safety", "Fuel Economy", "Price"],
    datasets: [
      { legend: "Sedan", values: [70, 90, 88, 82, 75] },
      { legend: "SUV", values: [80, 85, 92, 55, 60] },
      { legend: "EV", values: [92, 78, 90, 95, 50] },
    ],
  },
  config: {
    colors: ["#1e40af", "#dc2626", "#064e3b"],
    radar: { fillOpacity: 0.2, strokeWidth: 2 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Toast
  {
    title: "Company Culture Index",
    subtitle: "Startup vs enterprise vs agency workplace ratings",
    style: "Toast" as const,
    chart: <CompanyCultureRadar />,
    featured: true,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import ToastRadarChart from "./charts/toast-radar-chart";

const chart = ToastRadarChart({
  data: {
    labels: ["Innovation", "Work-Life", "Compensation", "Growth", "Diversity"],
    datasets: [
      { legend: "Startup", values: [95, 55, 65, 88, 72] },
      { legend: "Enterprise", values: [60, 80, 90, 70, 85] },
      { legend: "Agency", values: [82, 65, 72, 78, 68] },
    ],
  },
  config: {
    colors: ["#8b5cf6", "#f59e0b", "#06b6d4"],
    radar: { fillOpacity: 0.3, strokeWidth: 1.5 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Toast
  {
    title: "Nutrition Profile",
    subtitle: "Macronutrient breakdown for chicken breast, brown rice, and avocado",
    style: "Toast" as const,
    chart: <NutritionProfileRadar />,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import ToastRadarChart from "./charts/toast-radar-chart";

const chart = ToastRadarChart({
  data: {
    labels: ["Protein", "Carbs", "Fat", "Fiber", "Vitamins"],
    datasets: [
      { legend: "Chicken Breast", values: [95, 5, 20, 0, 35] },
      { legend: "Brown Rice", values: [15, 90, 8, 65, 30] },
      { legend: "Avocado", values: [12, 20, 85, 55, 72] },
    ],
  },
  config: {
    colors: ["#22c55e", "#f97316", "#ef4444"],
    radar: { fillOpacity: 0.25 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
  // Toast
  {
    title: "Frontend Framework Comparison",
    subtitle: "React vs Vue vs Svelte across performance, DX, ecosystem, and community",
    style: "Toast" as const,
    chart: <FrameworkComparisonRadar />,
    height: 400,
    code: `import Widget from "@flitterjs/react";
import ToastRadarChart from "./charts/toast-radar-chart";

const chart = ToastRadarChart({
  data: {
    labels: ["Performance", "DX", "Ecosystem", "Learning Curve", "Community"],
    datasets: [
      { legend: "React", values: [82, 78, 95, 65, 98] },
      { legend: "Vue", values: [80, 92, 75, 88, 82] },
      { legend: "Svelte", values: [95, 90, 55, 92, 60] },
    ],
  },
  config: {
    colors: ["#61dafb", "#42b883", "#ff3e00"],
    radar: { fillOpacity: 0.15, strokeWidth: 2.5 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
  },
];

export const pages: ChartModule = [
  {
    slug: ["radar-chart"],
    title: "Radar Chart",
    description:
      "Compare multiple dimensions at once. Skill profiles, product comparisons, performance reviews — see the shape of multi-variate data.",
    pageType: "overview",
    hasAdvanced: true,
    showcaseExamples,
    styles: [
      toastSummary("radar-chart", <BasicRadarChart />),
      agSummary("radar-chart", <BasicAgRadarChart />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
