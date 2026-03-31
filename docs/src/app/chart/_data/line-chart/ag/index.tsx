import { agStylePage } from "../../styles/ag";
import {
  DefaultAgLineChart,
  SplineAgLineChart,
  StockPriceAgLineChart,
} from "./examples.generated";

const lineConfigSections = [
  {
    title: "Line",
    rows: [
      { property: "line.strokeWidth", type: "number", default: "2", description: "Line stroke width (px)" },
      { property: "line.spline", type: "boolean", default: "false", description: "Use spline (curved) interpolation" },
    ],
  },
];

export const agStyle = agStylePage("line-chart", {
  extraConfigSections: lineConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultAgLineChart.Component />,
      code: DefaultAgLineChart.code,
    },
    {
      title: "Spline",
      chart: <SplineAgLineChart.Component />,
      code: SplineAgLineChart.code,
    },
    {
      title: "Stock Prices",
      chart: <StockPriceAgLineChart.Component />,
      code: StockPriceAgLineChart.code,
    },
  ],
});
