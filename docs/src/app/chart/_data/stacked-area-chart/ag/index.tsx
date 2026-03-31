import { agStylePage } from "../../styles/ag";
import { DefaultAgStackedAreaChart, ResourceAllocationStackedArea, RevenueStreamsMinimalAg } from "./examples.generated";

const areaConfigSections = [
  {
    title: "Area",
    rows: [
      { property: "area.opacity", type: "number", default: "0.7", description: "Fill opacity of stacked areas" },
      { property: "area.strokeWidth", type: "number", default: "2", description: "Stroke width of area outlines (px)" },
      { property: "area.spline", type: "boolean", default: "false", description: "Use spline interpolation for smooth curves" },
    ],
  },
];

export const agStyle = agStylePage("stacked-area-chart", {
  extraConfigSections: areaConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultAgStackedAreaChart.Component />,
      code: DefaultAgStackedAreaChart.code,
    },
    {
      title: "Resource Allocation",
      chart: <ResourceAllocationStackedArea.Component />,
      code: ResourceAllocationStackedArea.code,
    },
    {
      title: "Revenue Streams (Minimal)",
      chart: <RevenueStreamsMinimalAg.Component />,
      code: RevenueStreamsMinimalAg.code,
    },
  ],
});
