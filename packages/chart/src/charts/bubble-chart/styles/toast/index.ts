import type { BubbleChartCustom, GetScaleOptionsFn } from "@headless/bubble-chart/types";
import type { StyleConfig } from "../../plugin";
import type { ToastBubbleChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastBubble } from "./parts/bubble";
import { toastSeries } from "./parts/series";
import {
  toastLayout,
  toastTitle,
  toastLegend,
  toastXAxisLabel,
  toastYAxisLabel,
  toastXAxisTick,
  toastYAxisTick,
  toastXAxisLine,
  toastYAxisLine,
  toastGridXLine,
  toastGridYLine,
  toastAxisCorner,
  toastXAxis,
  toastYAxis,
  toastScaleOptions,
} from "@shared/styles/toast";

export { type ToastBubbleChartConfig } from "./config";

const toastCustom: Partial<BubbleChartCustom<ToastBubbleChartConfig>> = {
  layout: toastLayout,
  bubble: toastBubble,
  series: toastSeries,
  legend: toastLegend,
  title: toastTitle,
  axisCorner: toastAxisCorner,
  xAxisLabel: toastXAxisLabel,
  yAxisLabel: toastYAxisLabel,
  xAxisTick: toastXAxisTick,
  yAxisTick: toastYAxisTick,
  xAxisLine: toastXAxisLine,
  yAxisLine: toastYAxisLine,
  gridXLine: toastGridXLine,
  gridYLine: toastGridYLine,
  xAxis: (args, context) =>
    toastXAxis(args, { type: "value" }, context),
  yAxis: (args, context) =>
    toastYAxis(args, { type: "value" }, context),
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(Math.min(ctx.width, ctx.height));

export const toastStyleConfig: StyleConfig<ToastBubbleChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
