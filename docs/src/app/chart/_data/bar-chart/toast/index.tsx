import { toastStylePage } from "../../styles/toast";
import {
  VerticalToastBarChart,
  HorizontalToastBarChart,
  NegativeVerticalToastBarChart,
  NegativeHorizontalToastBarChart,
} from "./examples.generated";

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
    {
      title: "Vertical",
      chart: <VerticalToastBarChart.Component />,
      code: VerticalToastBarChart.code,
    },
    {
      title: "Horizontal",
      chart: <HorizontalToastBarChart.Component />,
      code: HorizontalToastBarChart.code,
    },
    {
      title: "Negative Vertical",
      chart: <NegativeVerticalToastBarChart.Component />,
      code: NegativeVerticalToastBarChart.code,
    },
    {
      title: "Negative Horizontal",
      chart: <NegativeHorizontalToastBarChart.Component />,
      code: NegativeHorizontalToastBarChart.code,
    },
  ],
});
