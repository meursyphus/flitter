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
  { title: "Bar Chart", subtitle: "Toast Style", chart: <VerticalToastBarChart />, command: "flitter add bar-chart", href: "/chart/bar-chart" },
  { title: "Bar Chart", subtitle: "AG Style", chart: <VerticalAgBarChart />, command: "flitter add bar-chart --style ag", href: "/chart/bar-chart" },

  // Line
  { title: "Line Chart", subtitle: "Toast Style", chart: <DefaultToastLineChart />, command: "flitter add line-chart", href: "/chart/line-chart" },
  { title: "Line Chart", subtitle: "AG Style", chart: <DefaultAgLineChart />, command: "flitter add line-chart --style ag", href: "/chart/line-chart" },

  // Area
  { title: "Area Chart", subtitle: "Toast Style", chart: <DefaultToastAreaChart />, command: "flitter add area-chart", href: "/chart/area-chart" },
  { title: "Area Chart", subtitle: "AG Style", chart: <DefaultAgAreaChart />, command: "flitter add area-chart --style ag", href: "/chart/area-chart" },

  // Stacked Bar
  { title: "Stacked Bar", subtitle: "Toast Style", chart: <VerticalToastStackedBarChart />, command: "flitter add stacked-bar-chart", href: "/chart/stacked-bar-chart" },
  { title: "Stacked Bar", subtitle: "AG Style", chart: <VerticalAgStackedBarChart />, command: "flitter add stacked-bar-chart --style ag", href: "/chart/stacked-bar-chart" },

  // Stacked Area
  { title: "Stacked Area", subtitle: "Toast Style", chart: <DefaultToastStackedAreaChart />, command: "flitter add stacked-area-chart", href: "/chart/stacked-area-chart" },
  { title: "Stacked Area", subtitle: "AG Style", chart: <DefaultAgStackedAreaChart />, command: "flitter add stacked-area-chart --style ag", href: "/chart/stacked-area-chart" },

  // Scatter
  { title: "Scatter Chart", subtitle: "Toast Style", chart: <DefaultToastScatterChart />, command: "flitter add scatter-chart", href: "/chart/scatter-chart" },
  { title: "Scatter Chart", subtitle: "AG Style", chart: <DefaultAgScatterChart />, command: "flitter add scatter-chart --style ag", href: "/chart/scatter-chart" },

  // Bubble
  { title: "Bubble Chart", subtitle: "Toast Style", chart: <DefaultToastBubbleChart />, command: "flitter add bubble-chart", href: "/chart/bubble-chart" },
  { title: "Bubble Chart", subtitle: "AG Style", chart: <DefaultAgBubbleChart />, command: "flitter add bubble-chart --style ag", href: "/chart/bubble-chart" },

  // Pie
  { title: "Pie Chart", subtitle: "Toast Style", chart: <BasicPieChart />, command: "flitter add pie-chart", href: "/chart/pie-chart" },
  { title: "Donut Chart", subtitle: "Toast Style", chart: <DonutPieChart />, command: "flitter add pie-chart", href: "/chart/pie-chart" },

  // Radar
  { title: "Radar Chart", subtitle: "Toast Style", chart: <BasicRadarChart />, command: "flitter add radar-chart", href: "/chart/radar-chart" },

  // Heatmap
  { title: "Heatmap Chart", subtitle: "Toast Style", chart: <BasicHeatmapChart />, command: "flitter add heatmap-chart", href: "/chart/heatmap-chart" },
];
