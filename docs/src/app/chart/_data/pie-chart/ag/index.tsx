import { agStylePage } from "../../styles/ag";
import {
  BasicAgPieChart,
  DonutAgPieChart,
  MarketShareAgPieChart,
  ExpenseBreakdownAgPieChart,
} from "./examples";

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
      chart: <BasicAgPieChart />,
      code: `import Widget from "@flitterjs/react";
import PieChart from "./charts/pie-chart";

const chart = PieChart({
  data: {
    datasets: [
      { name: "Chrome", value: 65 },
      { name: "Safari", value: 18 },
      { name: "Firefox", value: 8 },
      { name: "Edge", value: 5 },
      { name: "Other", value: 4 },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Donut",
      chart: <DonutAgPieChart />,
      code: `import Widget from "@flitterjs/react";
import PieChart from "./charts/pie-chart";

const chart = PieChart({
  data: {
    datasets: [
      { name: "Chrome", value: 65 },
      { name: "Safari", value: 18 },
      { name: "Firefox", value: 8 },
      { name: "Edge", value: 5 },
      { name: "Other", value: 4 },
    ],
  },
  config: {
    pie: { innerRadiusRatio: 0.5 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Market Share",
      chart: <MarketShareAgPieChart />,
      code: `import Widget from "@flitterjs/react";
import PieChart from "./charts/pie-chart";

const chart = PieChart({
  data: {
    datasets: [
      { name: "Apple", value: 28 },
      { name: "Samsung", value: 22 },
      { name: "Xiaomi", value: 13 },
      { name: "Oppo", value: 9 },
      { name: "Vivo", value: 8 },
      { name: "Others", value: 20 },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Expense Breakdown",
      chart: <ExpenseBreakdownAgPieChart />,
      code: `import Widget from "@flitterjs/react";
import PieChart from "./charts/pie-chart";

const chart = PieChart({
  data: {
    datasets: [
      { name: "Housing", value: 1800 },
      { name: "Food", value: 650 },
      { name: "Transport", value: 420 },
      { name: "Utilities", value: 280 },
      { name: "Healthcare", value: 350 },
      { name: "Entertainment", value: 200 },
      { name: "Education", value: 300 },
      { name: "Savings", value: 500 },
    ],
  },
  config: {
    pie: { innerRadiusRatio: 0.4 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
