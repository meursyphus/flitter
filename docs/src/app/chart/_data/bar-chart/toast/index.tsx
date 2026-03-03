import { toastStylePage } from "../../styles/toast";
import {
  VerticalToastBarChart,
  HorizontalToastBarChart,
  NegativeVerticalToastBarChart,
  NegativeHorizontalToastBarChart,
} from "./examples";

const barConfigSections = [
  {
    title: "Bar",
    rows: [
      { property: "bar.gap", type: "number", default: "1", description: "Horizontal margin between bars in a group (px)" },
      { property: "bar.cornerRadius", type: "number", default: "0", description: "Bar corner radius (px)" },
    ],
  },
];

export const toastStyle = toastStylePage("bar-chart", {
  extraConfigSections: barConfigSections,
  examples: [
    { title: "Vertical", chart: <VerticalToastBarChart /> },
    { title: "Horizontal", chart: <HorizontalToastBarChart /> },
    { title: "Negative Vertical", chart: <NegativeVerticalToastBarChart /> },
    { title: "Negative Horizontal", chart: <NegativeHorizontalToastBarChart /> },
  ],
});
