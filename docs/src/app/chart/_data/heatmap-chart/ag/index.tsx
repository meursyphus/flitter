import { agStylePage } from "../../styles/ag";
import {
  BasicHeatmapAg,
  ServerLoadAg,
  CorrelationMatrixAg,
  GithubActivityAg,
  SalesByRegionAg,
} from "./examples.generated";

const heatmapConfigSections = [
  {
    title: "Heatmap",
    description: "Heatmap-specific visual settings.",
    rows: [
      { property: "heatmap.colorRange", type: "[string, string, string]", default: '["#FDE68A", "#F97316", "#B91C1C"]', description: "Color gradient range [low, mid, high]" },
      { property: "heatmap.segment.gap", type: "number", default: "0", description: "Gap between cells (px)" },
    ],
  },
];

export const agStyle = agStylePage("heatmap-chart", {
  extraConfigSections: heatmapConfigSections,
  examples: [
    {
      title: "Basic Heatmap",
      chart: <BasicHeatmapAg.Component />,
      code: BasicHeatmapAg.code,
    },
    {
      title: "Server Load",
      chart: <ServerLoadAg.Component />,
      code: ServerLoadAg.code,
    },
    {
      title: "Correlation Matrix",
      chart: <CorrelationMatrixAg.Component />,
      code: CorrelationMatrixAg.code,
    },
    {
      title: "Activity Tracker",
      chart: <GithubActivityAg.Component />,
      code: GithubActivityAg.code,
    },
    {
      title: "Sales by Region",
      chart: <SalesByRegionAg.Component />,
      code: SalesByRegionAg.code,
    },
  ],
});
