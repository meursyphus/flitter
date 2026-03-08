import type { BarChartCustom } from "../../../_flitter/headless/bar-chart";
import type { GetScaleOptionsFn } from "../../../_flitter/headless/bar-chart";
import type { ToastStackedBarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "../../../_flitter/shared/utils/index";
import { toastBar } from "./parts/bar";
import { toastDataView } from "./parts/data-view";
import { toastBarBox } from "./parts/bar-box";
import {
  toastTitle,
  toastLegend,
  toastScaleOptions,
  cartesian,
} from "../../../toast-base/index";

export { type ToastStackedBarChartConfig } from "./config";

const toastCustom: Partial<BarChartCustom<ToastStackedBarChartConfig>> = {
  layout: cartesian.toastLayout,
  bar: toastBar,
  dataView: toastDataView,
  barBox: toastBarBox,
  legend: toastLegend,
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
    cartesian.toastXAxis(args, { type: context.direction === "vertical" ? "label" : "value" }, context),
  yAxis: (args, context) =>
    cartesian.toastYAxis(args, { type: context.direction === "vertical" ? "value" : "label" }, context),
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.direction === "vertical" ? ctx.height : ctx.width);

export const toastStyleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<ToastStackedBarChartConfig>) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
