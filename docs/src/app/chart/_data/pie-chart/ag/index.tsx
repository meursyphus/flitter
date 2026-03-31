import { agStylePage } from "../../styles/ag";
import {
  BasicAgPieChart,
  DonutAgPieChart,
  MarketShareAgPieChart,
  ExpenseBreakdownAgPieChart,
  QuarterlyReportAgPie,
} from "./examples.generated";

const pieConfigSections = [
  {
    title: "Pie",
    description: "Pie-specific visual settings.",
    rows: [
      { property: "pie.innerRadiusRatio", type: "number", default: "0", description: "Inner radius ratio (0 = pie, 0.5 = donut)" },
      { property: "pie.strokeColor", type: "string", default: '"white"', description: "Border color between slices" },
      { property: "pie.strokeWidth", type: "number", default: "2", description: "Border width between slices (px)" },
    ],
  },
];

export const agStyle = agStylePage("pie-chart", {
  extraConfigSections: pieConfigSections,
  examples: [
    {
      title: "Basic Pie",
      chart: <BasicAgPieChart.Component />,
      code: BasicAgPieChart.code,
    },
    {
      title: "Donut",
      chart: <DonutAgPieChart.Component />,
      code: DonutAgPieChart.code,
    },
    {
      title: "Market Share",
      chart: <MarketShareAgPieChart.Component />,
      code: MarketShareAgPieChart.code,
    },
    {
      title: "Expense Breakdown",
      chart: <ExpenseBreakdownAgPieChart.Component />,
      code: ExpenseBreakdownAgPieChart.code,
    },
    {
      title: "Quarterly Report Figure",
      chart: <QuarterlyReportAgPie.Component />,
      code: QuarterlyReportAgPie.code,
    },
  ],
});
