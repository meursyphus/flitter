import type { ScatterChartCustom, GetScaleOptionsFn } from "@headless/scatter-chart/types";
import type { StyleConfig } from "../../plugin";
import type { ToastScatterChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastScatter } from "./parts/scatter";
import {
  toastTitle,
  toastLegend,
  toastScaleOptions,
  cartesian,
} from "@styles/toast";

export { type ToastScatterChartConfig } from "./config";

const toastCustom: Partial<ScatterChartCustom<ToastScatterChartConfig>> = {
  layout: cartesian.toastLayout,
  scatter: toastScatter,
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
  xAxis: (args, context) => cartesian.toastXAxis(args, { type: "value" }, context),
  yAxis: (args, context) => cartesian.toastYAxis(args, { type: "value" }, context),
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(Math.min(ctx.width, ctx.height));

export const toastStyleConfig: StyleConfig<ToastScatterChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
