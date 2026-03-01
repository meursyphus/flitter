import type { BubbleChartCustom, GetScaleOptionsFn } from "@headless/bubble-chart/types";
import type { StyleConfig } from "../../plugin";
import type { AgBubbleChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge } from "@utils/index";
import { agBubble } from "./parts/bubble";
import { agSeries } from "./parts/series";
import {
  agLayout,
  agTitle,
  agLegend,
  agXAxisLabel,
  agYAxisLabel,
  agXAxisTick,
  agYAxisTick,
  agXAxisLine,
  agYAxisLine,
  agGridXLine,
  agGridYLine,
  agAxisCorner,
  agXAxis,
  agYAxis,
  agXAxisBox,
  agYAxisBox,
  agScaleOptions,
} from "@shared/styles/ag";

export { type AgBubbleChartConfig } from "./config";

const agCustom: Partial<BubbleChartCustom<AgBubbleChartConfig>> = {
  layout: agLayout,
  bubble: agBubble,
  series: agSeries,
  legend: agLegend,
  title: agTitle,
  axisCorner: agAxisCorner,
  xAxisLabel: agXAxisLabel,
  yAxisLabel: agYAxisLabel,
  xAxisTick: agXAxisTick,
  yAxisTick: agYAxisTick,
  xAxisLine: agXAxisLine,
  yAxisLine: agYAxisLine,
  gridXLine: agGridXLine,
  gridYLine: agGridYLine,
  xAxis: (args, context) => agXAxis(args, { type: "value" }, context),
  yAxis: (args, context) => agYAxis(args, { type: "value" }, context),
  xAxisBox: agXAxisBox,
  yAxisBox: agYAxisBox,
};

const agGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  agScaleOptions(Math.min(ctx.width, ctx.height));

export const agStyleConfig: StyleConfig<AgBubbleChartConfig> = {
  custom: agCustom,
  createConfig: (config) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
