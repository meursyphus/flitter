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
    description: "Custom angularAxisLabel with emoji icons per tech skill. Labels show skill-specific emoji + bold text.",
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
    description: "Light blue background tint with right-aligned legend and translucent fill.",
    style: "AG" as const,
    chart: <SkillComparisonAgRadar.Component />,
    height: 400,
    code: SkillComparisonAgRadar.code,
  },
  // Toast
  {
    title: "Product Review Scores",
    subtitle: "Rate three products across price, quality, design, durability, and support",
    description: "Custom radialAxisLabel with green badge pills showing percentage values. Tinted green grid lines.",
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
    description: "Bold jewel-tone palette with high fill opacity (0.4) and thick strokes. Bottom legend layout.",
    style: "AG" as const,
    chart: <TeamPerformanceAgRadar.Component />,
    height: 400,
    code: TeamPerformanceAgRadar.code,
  },
  // Toast
  {
    title: "Athlete Profile",
    subtitle: "Physical attributes of a sprinter, marathoner, and gymnast",
    description: "Wireframe style: near-zero fill (0.04) with extra-thick 3.5px strokes. Emphasized spoke lines.",
    style: "Toast" as const,
    chart: <AthleteProfileRadar.Component />,
    featured: true,
    height: 400,
    code: AthleteProfileRadar.code,
  },
  // AG
  {
    title: "Product Review (AG)",
    subtitle: "AG style product comparison with title and subtitle",
    description: "Title + subtitle config enabled. Low fill opacity for a clean, editorial look.",
    style: "AG" as const,
    chart: <ProductReviewAgRadar.Component />,
    height: 400,
    code: ProductReviewAgRadar.code,
  },
  // Toast
  {
    title: "Restaurant Ratings",
    subtitle: "Three dining spots compared across food, service, ambiance, value, and location",
    description: "Custom title widget with amber pill-shaped background badge. Warm earth-tone palette.",
    style: "Toast" as const,
    chart: <RestaurantRatingRadar.Component />,
    height: 400,
    code: RestaurantRatingRadar.code,
  },
  // AG
  {
    title: "Athlete Profile (AG)",
    subtitle: "Dark-mode radar with bright contrasting dataset colors",
    description: "Dark slate background (#1e293b) with light grid/axis lines and warm neon dataset colors.",
    style: "AG" as const,
    chart: <AthleteProfileAgRadar.Component />,
    height: 400,
    code: AthleteProfileAgRadar.code,
  },
  // Toast
  {
    title: "Car Comparison",
    subtitle: "Sedan vs SUV vs EV across 5 buying criteria",
    description: "Dark-themed config: light grid/axis on dark background, neon dataset colors, dark tooltip.",
    style: "Toast" as const,
    chart: <CarComparisonRadar.Component />,
    height: 400,
    code: CarComparisonRadar.code,
  },
  // Toast
  {
    title: "Company Culture Index",
    subtitle: "Startup vs enterprise vs agency workplace ratings across 6 factors",
    description: "Centered title, bottom legend with wide gap, pastel color palette, purple-tinted grid.",
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
    description: "Custom radialAxisLabel with traffic-light coloring (green/amber/red) based on value thresholds. Thick green grid.",
    style: "Toast" as const,
    chart: <NutritionProfileRadar.Component />,
    height: 400,
    code: NutritionProfileRadar.code,
  },
  // Toast
  {
    title: "Frontend Framework Comparison",
    subtitle: "React vs Vue vs Svelte across performance, DX, ecosystem, and community",
    description: "Custom legend with brand-colored circular markers and bold tinted text per framework.",
    style: "Toast" as const,
    chart: <FrameworkComparisonRadar.Component />,
    height: 400,
    code: FrameworkComparisonRadar.code,
  },
  // Toast
  {
    title: "Skill Duel: Alice vs Bob",
    subtitle: "Per-axis winner indicators show who leads each dimension",
    description: "Custom angularAxisLabel showing dimension winner (A/B) with point differential below each label.",
    style: "Toast" as const,
    chart: <SkillComparisonRadarChart.Component />,
    height: 400,
    code: SkillComparisonRadarChart.code,
  },
  // Toast
  {
    title: "Team KPI Heatmap",
    subtitle: "High-opacity fills create a layered heatmap effect across three teams",
    description: "High fillOpacity (0.55) with near-invisible stroke (0.5px). Centered title, bottom legend.",
    style: "Toast" as const,
    chart: <TeamPerformanceRadarChart.Component />,
    height: 400,
    code: TeamPerformanceRadarChart.code,
  },
  // Toast
  {
    title: "Team Performance Card",
    subtitle: "HR review card comparing quarterly performance across 5 competencies",
    description: "Custom angularAxisLabel highlighting weak scores (<80) with red badge containers.",
    style: "Toast" as const,
    chart: <TeamPerformanceCardToast.Component />,
    height: 400,
    code: TeamPerformanceCardToast.code,
  },
  // AG
  {
    title: "Assessment Overview",
    subtitle: "360-degree evaluation with self, manager, and peer ratings",
    description: "Light gray background with right-top legend positioning for a clean dashboard look.",
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
