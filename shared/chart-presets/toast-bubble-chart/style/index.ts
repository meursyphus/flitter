import type { BubbleChartCustom, BubbleChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { ToastBubbleChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { toastBubble } from "./parts/bubble";
import {
  toastTitle,
  toastLegend,
  toastScaleOptions,
  cartesian,
} from "../../_styles/toast/index";

export { type ToastBubbleChartConfig } from "./config";

const toastCustom: Partial<BubbleChartCustom<ToastBubbleChartConfig>> = {
  layout: cartesian.toastLayout,
  bubble: toastBubble,
  legend: (args, context) => toastLegend(args, context, { markerShape: "circle" }),
  title: toastTitle,
  axisCorner: cartesian.toastAxisCorner,
  xAxisLabel: cartesian.toastXAxisLabel,
  yAxisLabel: cartesian.toastYAxisLabel,
  xAxisTick: cartesian.toastXAxisTick,
  yAxisTick: cartesian.toastYAxisTick,
  xAxisLine: cartesian.toastXAxisLine,
  yAxisLine: cartesian.toastYAxisLine,
  gridXLine: cartesian.toastGridXLine,
  gridYLine: cartesian.toastGridYLine,
  xAxis: (args, context) =>
    cartesian.toastXAxis(args, { type: "value" }, context),
  yAxis: (args, context) =>
    cartesian.toastYAxis(args, { type: "value" }, context),
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(Math.min(ctx.width, ctx.height));

export const toastStyleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<ToastBubbleChartConfig>) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
