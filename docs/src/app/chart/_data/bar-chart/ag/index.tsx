import { agStylePage } from "../../styles/ag";
import {
  VerticalAgBarChart,
  HorizontalAgBarChart,
  NegativeVerticalAgBarChart,
  NegativeHorizontalAgBarChart,
} from "./examples";

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
    { title: "Vertical", chart: <VerticalAgBarChart /> },
    { title: "Horizontal", chart: <HorizontalAgBarChart /> },
    { title: "Negative Vertical", chart: <NegativeVerticalAgBarChart /> },
    { title: "Negative Horizontal", chart: <NegativeHorizontalAgBarChart /> },
  ],
});
