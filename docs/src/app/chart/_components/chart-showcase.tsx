import type { ChartItem } from "./chart-carousel";

// Bar Chart
import {
  VerticalToastBarChart,
  HorizontalToastBarChart,
} from "../_data/bar-chart/toast/examples.generated";
import {
  VerticalAgBarChart,
  HorizontalAgBarChart,
} from "../_data/bar-chart/ag/examples.generated";

// Line Chart
import { DefaultToastLineChart } from "../_data/line-chart/toast/examples.generated";
import { DefaultAgLineChart } from "../_data/line-chart/ag/examples.generated";

// Area Chart
import { DefaultToastAreaChart } from "../_data/area-chart/toast/examples.generated";
import { DefaultAgAreaChart } from "../_data/area-chart/ag/examples.generated";

// Stacked Bar Chart
import { RegionalRevenueToast } from "../_data/stacked-bar-chart/toast/examples.generated";
import { RegionalSalesAg } from "../_data/stacked-bar-chart/ag/examples.generated";

// Stacked Area Chart
import { DefaultToastStackedAreaChart } from "../_data/stacked-area-chart/toast/examples.generated";
import { DefaultAgStackedAreaChart } from "../_data/stacked-area-chart/ag/examples.generated";

// Scatter Chart
import { DefaultToastScatterChart } from "../_data/scatter-chart/toast/examples.generated";
import { DefaultAgScatterChart } from "../_data/scatter-chart/ag/examples.generated";

// Bubble Chart
import { DefaultToastBubbleChart } from "../_data/bubble-chart/toast/examples.generated";
import { DefaultAgBubbleChart } from "../_data/bubble-chart/ag/examples.generated";

// Pie Chart
import { BasicPieChart, DonutPieChart } from "../_data/pie-chart/toast/examples.generated";

// Radar Chart
import { BasicRadarChart } from "../_data/radar-chart/toast/examples.generated";

// Heatmap Chart
import { BasicHeatmapToast } from "../_data/heatmap-chart/toast/examples.generated";

export const chartShowcase: ChartItem[] = [
  // Bar
  { title: "Bar Chart", subtitle: "Toast Style", chart: <VerticalToastBarChart.Component />, command: "npx flitter-ui add bar-chart", href: "/chart/bar-chart" },
  { title: "Bar Chart", subtitle: "AG Style", chart: <VerticalAgBarChart.Component />, command: "npx flitter-ui add bar-chart --style ag", href: "/chart/bar-chart" },

  // Line
  { title: "Line Chart", subtitle: "Toast Style", chart: <DefaultToastLineChart.Component />, command: "npx flitter-ui add line-chart", href: "/chart/line-chart" },
  { title: "Line Chart", subtitle: "AG Style", chart: <DefaultAgLineChart.Component />, command: "npx flitter-ui add line-chart --style ag", href: "/chart/line-chart" },

  // Area
  { title: "Area Chart", subtitle: "Toast Style", chart: <DefaultToastAreaChart.Component />, command: "npx flitter-ui add area-chart", href: "/chart/area-chart" },
  { title: "Area Chart", subtitle: "AG Style", chart: <DefaultAgAreaChart.Component />, command: "npx flitter-ui add area-chart --style ag", href: "/chart/area-chart" },

  // Stacked Bar
  { title: "Stacked Bar", subtitle: "Toast Style", chart: <RegionalRevenueToast.Component />, command: "npx flitter-ui add stacked-bar-chart", href: "/chart/stacked-bar-chart" },
  { title: "Stacked Bar", subtitle: "AG Style", chart: <RegionalSalesAg.Component />, command: "npx flitter-ui add stacked-bar-chart --style ag", href: "/chart/stacked-bar-chart" },

  // Stacked Area
  { title: "Stacked Area", subtitle: "Toast Style", chart: <DefaultToastStackedAreaChart.Component />, command: "npx flitter-ui add stacked-area-chart", href: "/chart/stacked-area-chart" },
  { title: "Stacked Area", subtitle: "AG Style", chart: <DefaultAgStackedAreaChart.Component />, command: "npx flitter-ui add stacked-area-chart --style ag", href: "/chart/stacked-area-chart" },

  // Scatter
  { title: "Scatter Chart", subtitle: "Toast Style", chart: <DefaultToastScatterChart.Component />, command: "npx flitter-ui add scatter-chart", href: "/chart/scatter-chart" },
  { title: "Scatter Chart", subtitle: "AG Style", chart: <DefaultAgScatterChart.Component />, command: "npx flitter-ui add scatter-chart --style ag", href: "/chart/scatter-chart" },

  // Bubble
  { title: "Bubble Chart", subtitle: "Toast Style", chart: <DefaultToastBubbleChart.Component />, command: "npx flitter-ui add bubble-chart", href: "/chart/bubble-chart" },
  { title: "Bubble Chart", subtitle: "AG Style", chart: <DefaultAgBubbleChart.Component />, command: "npx flitter-ui add bubble-chart --style ag", href: "/chart/bubble-chart" },

  // Pie
  { title: "Pie Chart", subtitle: "Toast Style", chart: <BasicPieChart.Component />, command: "npx flitter-ui add pie-chart", href: "/chart/pie-chart" },
  { title: "Donut Chart", subtitle: "Toast Style", chart: <DonutPieChart.Component />, command: "npx flitter-ui add pie-chart", href: "/chart/pie-chart" },

  // Radar
  { title: "Radar Chart", subtitle: "Toast Style", chart: <BasicRadarChart.Component />, command: "npx flitter-ui add radar-chart", href: "/chart/radar-chart" },

  // Heatmap
  { title: "Heatmap Chart", subtitle: "Toast Style", chart: <BasicHeatmapToast.Component />, command: "npx flitter-ui add heatmap-chart", href: "/chart/heatmap-chart" },
];
