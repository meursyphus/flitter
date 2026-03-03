import { toastStylePage } from "../../styles/toast";
import {
  VerticalToastStackedBarChart,
  HorizontalToastStackedBarChart,
  NegativeVerticalToastStackedBarChart,
  NegativeHorizontalToastStackedBarChart,
} from "./examples";

const barConfigSections = [
  {
    title: "Bar",
    rows: [
      { property: "bar.gap", type: "number", default: "0", description: "Gap between stacked bar groups (px)" },
    ],
  },
];

export const toastStyle = toastStylePage("stacked-bar-chart", {
  extraConfigSections: barConfigSections,
  examples: [
    { title: "Vertical", chart: <VerticalToastStackedBarChart /> },
    { title: "Horizontal", chart: <HorizontalToastStackedBarChart /> },
    { title: "Negative Vertical", chart: <NegativeVerticalToastStackedBarChart /> },
    { title: "Negative Horizontal", chart: <NegativeHorizontalToastStackedBarChart /> },
  ],
});
