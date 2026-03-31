import { agStylePage } from "../../styles/ag";
import {
  DefaultAgScatterChart,
  FilledAgScatterChart,
} from "./examples.generated";

const scatterConfigSections = [
  {
    title: "Scatter",
    rows: [
      { property: "scatter.size", type: "number", default: "10", description: "Point diameter (px)" },
      { property: "scatter.strokeWidth", type: "number", default: "2", description: "Stroke width (px)" },
    ],
  },
];

export const agStyle = agStylePage("scatter-chart", {
  extraConfigSections: scatterConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultAgScatterChart.Component />,
      code: DefaultAgScatterChart.code,
    },
    {
      title: "Small Points",
      chart: <FilledAgScatterChart.Component />,
      code: FilledAgScatterChart.code,
    },
  ],
});
