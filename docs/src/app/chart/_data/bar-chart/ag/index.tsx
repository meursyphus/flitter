import { agStylePage } from "../../styles/ag";
import {
  VerticalAgBarChart,
  HorizontalAgBarChart,
  NegativeVerticalAgBarChart,
  NegativeHorizontalAgBarChart,
} from "./examples.generated";

const barConfigSections = [
  {
    title: "Bar",
    rows: [
      { property: "bar.gap", type: "number", default: "1", description: "Gap between bars in a group (px)" },
      { property: "bar.cornerRadius", type: "number", default: "0", description: "Bar corner radius (px)" },
    ],
  },
];

export const agStyle = agStylePage("bar-chart", {
  extraConfigSections: barConfigSections,
  examples: [
    {
      title: "Vertical",
      chart: <VerticalAgBarChart.Component />,
      code: VerticalAgBarChart.code,
    },
    {
      title: "Horizontal",
      chart: <HorizontalAgBarChart.Component />,
      code: HorizontalAgBarChart.code,
    },
    {
      title: "Negative Vertical",
      chart: <NegativeVerticalAgBarChart.Component />,
      code: NegativeVerticalAgBarChart.code,
    },
    {
      title: "Negative Horizontal",
      chart: <NegativeHorizontalAgBarChart.Component />,
      code: NegativeHorizontalAgBarChart.code,
    },
  ],
});
