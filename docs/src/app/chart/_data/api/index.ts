import type { ApiPageData } from "../types";
import { commonApiPage } from "./common";
import { areaChartApiPage } from "./area-chart";
import { barChartApiPage } from "./bar-chart";
import { bubbleChartApiPage } from "./bubble-chart";
import { candlestickChartApiPage } from "./candlestick-chart";
import { donutChartApiPage } from "./donut-chart";
import { heatmapChartApiPage } from "./heatmap-chart";
import { lineChartApiPage } from "./line-chart";
import { pieChartApiPage } from "./pie-chart";
import { radarChartApiPage } from "./radar-chart";
import { scatterChartApiPage } from "./scatter-chart";
import { stackedAreaChartApiPage } from "./stacked-area-chart";
import { stackedBarChartApiPage } from "./stacked-bar-chart";
import { sunburstChartApiPage } from "./sunburst-chart";
import { treemapChartApiPage } from "./treemap-chart";

export const apiPages: ApiPageData[] = [
  commonApiPage,
  areaChartApiPage,
  barChartApiPage,
  bubbleChartApiPage,
  candlestickChartApiPage,
  donutChartApiPage,
  heatmapChartApiPage,
  lineChartApiPage,
  pieChartApiPage,
  radarChartApiPage,
  scatterChartApiPage,
  stackedAreaChartApiPage,
  stackedBarChartApiPage,
  sunburstChartApiPage,
  treemapChartApiPage,
];
