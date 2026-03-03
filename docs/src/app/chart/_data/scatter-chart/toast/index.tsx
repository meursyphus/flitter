import { toastStylePage } from "../../styles/toast";
import {
  DefaultToastScatterChart,
  FilledToastScatterChart,
  LargeToastScatterChart,
} from "./examples";

const scatterConfigSections = [
  {
    title: "Scatter",
    rows: [
      { property: "scatter.size", type: "number", default: "10", description: "Point diameter (px)" },
      { property: "scatter.fill", type: "boolean", default: "false", description: "Fill points with color (true) or stroke only (false)" },
      { property: "scatter.strokeWidth", type: "number", default: "2", description: "Stroke width when fill is false (px)" },
    ],
  },
];

export const toastStyle = toastStylePage("scatter-chart", {
  extraConfigSections: scatterConfigSections,
  examples: [
    { title: "Default", chart: <DefaultToastScatterChart /> },
    { title: "Filled", chart: <FilledToastScatterChart /> },
    { title: "Large Points", chart: <LargeToastScatterChart /> },
  ],
});
