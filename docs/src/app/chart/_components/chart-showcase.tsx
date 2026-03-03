import type { ChartItem } from "./chart-carousel";

// Bar Chart
import {
  VerticalToastBarChart,
  HorizontalToastBarChart,
} from "../_data/bar-chart/toast/examples";
import {
  VerticalAgBarChart,
  HorizontalAgBarChart,
} from "../_data/bar-chart/ag/examples";

// Line Chart
import { DefaultToastLineChart } from "../_data/line-chart/toast/examples";
import { DefaultAgLineChart } from "../_data/line-chart/ag/examples";

// Area Chart
import { DefaultToastAreaChart } from "../_data/area-chart/toast/examples";
import { DefaultAgAreaChart } from "../_data/area-chart/ag/examples";

// Stacked Bar Chart
import { VerticalToastStackedBarChart } from "../_data/stacked-bar-chart/toast/examples";
import { VerticalAgStackedBarChart } from "../_data/stacked-bar-chart/ag/examples";

// Stacked Area Chart
import { DefaultToastStackedAreaChart } from "../_data/stacked-area-chart/toast/examples";
import { DefaultAgStackedAreaChart } from "../_data/stacked-area-chart/ag/examples";

// Scatter Chart
import { DefaultToastScatterChart } from "../_data/scatter-chart/toast/examples";
import { DefaultAgScatterChart } from "../_data/scatter-chart/ag/examples";

// Bubble Chart
import { DefaultToastBubbleChart } from "../_data/bubble-chart/toast/examples";
import { DefaultAgBubbleChart } from "../_data/bubble-chart/ag/examples";

// Pie Chart
import { BasicPieChart, DonutPieChart } from "../_data/pie-chart/toast/examples";

// Radar Chart
import { BasicRadarChart } from "../_data/radar-chart/toast/examples";

// Heatmap Chart
import { BasicHeatmapChart } from "../_data/heatmap-chart/toast/examples";

export const chartShowcase: ChartItem[] = [
  // Bar
  { title: "Bar Chart", subtitle: "Toast Style", chart: <VerticalToastBarChart /> },
  { title: "Bar Chart", subtitle: "AG Style", chart: <VerticalAgBarChart /> },

  // Line
  { title: "Line Chart", subtitle: "Toast Style", chart: <DefaultToastLineChart /> },
  { title: "Line Chart", subtitle: "AG Style", chart: <DefaultAgLineChart /> },

  // Area
  { title: "Area Chart", subtitle: "Toast Style", chart: <DefaultToastAreaChart /> },
  { title: "Area Chart", subtitle: "AG Style", chart: <DefaultAgAreaChart /> },

  // Stacked Bar
  { title: "Stacked Bar", subtitle: "Toast Style", chart: <VerticalToastStackedBarChart /> },
  { title: "Stacked Bar", subtitle: "AG Style", chart: <VerticalAgStackedBarChart /> },

  // Stacked Area
  { title: "Stacked Area", subtitle: "Toast Style", chart: <DefaultToastStackedAreaChart /> },
  { title: "Stacked Area", subtitle: "AG Style", chart: <DefaultAgStackedAreaChart /> },

  // Scatter
  { title: "Scatter Chart", subtitle: "Toast Style", chart: <DefaultToastScatterChart /> },
  { title: "Scatter Chart", subtitle: "AG Style", chart: <DefaultAgScatterChart /> },

  // Bubble
  { title: "Bubble Chart", subtitle: "Toast Style", chart: <DefaultToastBubbleChart /> },
  { title: "Bubble Chart", subtitle: "AG Style", chart: <DefaultAgBubbleChart /> },

  // Pie
  { title: "Pie Chart", subtitle: "Toast Style", chart: <BasicPieChart /> },
  { title: "Donut Chart", subtitle: "Toast Style", chart: <DonutPieChart /> },

  // Radar
  { title: "Radar Chart", subtitle: "Toast Style", chart: <BasicRadarChart /> },

  // Heatmap
  { title: "Heatmap Chart", subtitle: "Toast Style", chart: <BasicHeatmapChart /> },
];
