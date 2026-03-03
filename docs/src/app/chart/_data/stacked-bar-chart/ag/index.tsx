import { agStylePage } from "../../styles/ag";
import {
  VerticalAgStackedBarChart,
  HorizontalAgStackedBarChart,
  NegativeVerticalAgStackedBarChart,
  NegativeHorizontalAgStackedBarChart,
} from "./examples";

const barConfigSections = [
  {
    title: "Bar",
    rows: [
      { property: "bar.gap", type: "number", default: "0", description: "Gap between stacked bar groups (px)" },
    ],
  },
];

export const agStyle = agStylePage("stacked-bar-chart", {
  extraConfigSections: barConfigSections,
  examples: [
    { title: "Vertical", chart: <VerticalAgStackedBarChart /> },
    { title: "Horizontal", chart: <HorizontalAgStackedBarChart /> },
    { title: "Negative Vertical", chart: <NegativeVerticalAgStackedBarChart /> },
    { title: "Negative Horizontal", chart: <NegativeHorizontalAgStackedBarChart /> },
  ],
});
