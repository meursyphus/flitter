import type { BarChartCustom } from "@headless/bar-chart/types";
import type { GetScaleOptionsFn } from "@headless/bar-chart/types";
import type { StyleConfig } from "../../plugin";
import type { ToastBarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastBar } from "./parts/bar";
import { toastDataView } from "./parts/data-view";
import { toastBarBox } from "./parts/bar-box";
import {
  toastTitle,
  toastLegend,
  toastScaleOptions,
  cartesian,
} from "@styles/toast";

export { type ToastBarChartConfig } from "./config";

const toastCustom: Partial<BarChartCustom<ToastBarChartConfig>> = {
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

export const toastStyleConfig: StyleConfig<ToastBarChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
