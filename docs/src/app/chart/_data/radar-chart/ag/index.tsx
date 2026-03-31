import { agStylePage } from "../../styles/ag";
import {
  BasicAgRadarChart,
  SkillComparisonAgRadar,
  ProductReviewAgRadar,
  TeamPerformanceAgRadar,
  AssessmentOverviewAg,
} from "./examples.generated";

const radarConfigSections = [
  {
    title: "Radar",
    description: "Radar-specific visual settings.",
    rows: [
      { property: "radar.fillOpacity", type: "number", default: "0.3", description: "Fill opacity of radar areas (0-1)" },
      { property: "radar.strokeWidth", type: "number", default: "2", description: "Stroke width of radar outlines (px)" },
      { property: "radar.gridColor", type: "string", default: '"rgba(0, 0, 0, 0.1)"', description: "Grid line color" },
      { property: "radar.gridWidth", type: "number", default: "1", description: "Grid line width (px)" },
      { property: "radar.axisColor", type: "string", default: '"rgba(0, 0, 0, 0.1)"', description: "Axis line color" },
      { property: "radar.axisWidth", type: "number", default: "1", description: "Axis line width (px)" },
      { property: "radar.labelMargin", type: "number", default: "24", description: "Margin around radar for axis labels (px)" },
    ],
  },
];

export const agStyle = agStylePage("radar-chart", {
  extraConfigSections: radarConfigSections,
  examples: [
    {
      title: "Basic Radar",
      chart: <BasicAgRadarChart.Component />,
      code: BasicAgRadarChart.code,
    },
    {
      title: "Skill Comparison",
      chart: <SkillComparisonAgRadar.Component />,
      code: SkillComparisonAgRadar.code,
    },
    {
      title: "Product Review",
      chart: <ProductReviewAgRadar.Component />,
      code: ProductReviewAgRadar.code,
    },
    {
      title: "Team Performance",
      chart: <TeamPerformanceAgRadar.Component />,
      code: TeamPerformanceAgRadar.code,
    },
    {
      title: "Assessment Overview",
      chart: <AssessmentOverviewAg.Component />,
      code: AssessmentOverviewAg.code,
    },
  ],
});
