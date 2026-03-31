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
  TeamPerformanceCardToast,
} from "./toast/examples.generated";
import {
  BasicAgRadarChart,
  SkillComparisonAgRadar,
  ProductReviewAgRadar,
  TeamPerformanceAgRadar,
  AthleteProfileAgRadar,
  AssessmentOverviewAg,
} from "./ag/examples.generated";
import { advancedPage } from "./advanced";

const showcaseExamples: ShowcaseExample[] = [
  // Featured hero — Toast
  {
    title: "Developer Skill Profile",
    subtitle: "Compare senior, junior, and full-stack skill levels across 8 dimensions",
    style: "Toast" as const,
    chart: <BasicRadarChart.Component />,
    featured: true,
    height: 400,
    code: BasicRadarChart.code,
  },
  // AG
  {
    title: "Skill Comparison",
    subtitle: "Head-to-head comparison of two candidates across 6 soft skills",
    style: "AG" as const,
    chart: <SkillComparisonAgRadar.Component />,
    height: 400,
    code: SkillComparisonAgRadar.code,
  },
  // Toast
  {
    title: "Product Review Scores",
    subtitle: "Rate three products across price, quality, design, durability, and support",
    style: "Toast" as const,
    chart: <ProductReviewRadarChart.Component />,
    featured: true,
    height: 400,
    code: ProductReviewRadarChart.code,
  },
  // AG
  {
    title: "Team Performance KPIs",
    subtitle: "Compare frontend, backend, and DevOps team metrics",
    style: "AG" as const,
    chart: <TeamPerformanceAgRadar.Component />,
    height: 400,
    code: TeamPerformanceAgRadar.code,
  },
  // Toast
  {
    title: "Athlete Profile",
    subtitle: "Physical attributes of a sprinter, marathoner, and gymnast",
    style: "Toast" as const,
    chart: <AthleteProfileRadar.Component />,
    featured: true,
    height: 400,
    code: AthleteProfileRadar.code,
  },
  // AG
  {
    title: "Product Review (AG)",
    subtitle: "AG style product comparison across 5 dimensions",
    style: "AG" as const,
    chart: <ProductReviewAgRadar.Component />,
    height: 400,
    code: ProductReviewAgRadar.code,
  },
  // Toast
  {
    title: "Restaurant Ratings",
    subtitle: "Three dining spots compared across food, service, ambiance, value, and location",
    style: "Toast" as const,
    chart: <RestaurantRatingRadar.Component />,
    height: 400,
    code: RestaurantRatingRadar.code,
  },
  // AG
  {
    title: "Athlete Profile (AG)",
    subtitle: "AG style physical attribute comparison",
    style: "AG" as const,
    chart: <AthleteProfileAgRadar.Component />,
    height: 400,
    code: AthleteProfileAgRadar.code,
  },
  // Toast
  {
    title: "Car Comparison",
    subtitle: "Sedan vs SUV vs EV across 5 buying criteria",
    style: "Toast" as const,
    chart: <CarComparisonRadar.Component />,
    height: 400,
    code: CarComparisonRadar.code,
  },
  // Toast
  {
    title: "Company Culture Index",
    subtitle: "Startup vs enterprise vs agency workplace ratings",
    style: "Toast" as const,
    chart: <CompanyCultureRadar.Component />,
    featured: true,
    height: 400,
    code: CompanyCultureRadar.code,
  },
  // Toast
  {
    title: "Nutrition Profile",
    subtitle: "Macronutrient breakdown for chicken breast, brown rice, and avocado",
    style: "Toast" as const,
    chart: <NutritionProfileRadar.Component />,
    height: 400,
    code: NutritionProfileRadar.code,
  },
  // Toast
  {
    title: "Frontend Framework Comparison",
    subtitle: "React vs Vue vs Svelte across performance, DX, ecosystem, and community",
    style: "Toast" as const,
    chart: <FrameworkComparisonRadar.Component />,
    height: 400,
    code: FrameworkComparisonRadar.code,
  },
  // Toast — NEW
  {
    title: "Team Performance Card",
    subtitle: "HR review card comparing quarterly performance across 5 competencies",
    style: "Toast" as const,
    chart: <TeamPerformanceCardToast.Component />,
    height: 400,
    code: TeamPerformanceCardToast.code,
  },
  // AG — NEW
  {
    title: "Assessment Overview",
    subtitle: "360-degree evaluation with self, manager, and peer ratings",
    style: "AG" as const,
    chart: <AssessmentOverviewAg.Component />,
    height: 400,
    code: AssessmentOverviewAg.code,
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
      toastSummary("radar-chart", <BasicRadarChart.Component />),
      agSummary("radar-chart", <BasicAgRadarChart.Component />),
    ],
  },
  toastStyle,
  agStyle,
  advancedPage,
];
