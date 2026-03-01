import type { BarChartCustom } from "@headless/bar-chart/types";
import type { GetScaleOptionsFn } from "@headless/bar-chart/types";
import type { StyleConfig } from "../../plugin";
import type { ToastStackedBarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastBar } from "./parts/bar";
import { toastBarGroupBox } from "./parts/bar-group-box";
import { toastBarBox } from "./parts/bar-box";
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

export { type ToastStackedBarChartConfig } from "./config";

const toastCustom: Partial<BarChartCustom<ToastStackedBarChartConfig>> = {
  layout: toastLayout,
  bar: toastBar,
  barGroupBox: toastBarGroupBox,
  barBox: toastBarBox,
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
    toastXAxis(args, { type: context.direction === "vertical" ? "label" : "value" }, context),
  yAxis: (args, context) =>
    toastYAxis(args, { type: context.direction === "vertical" ? "value" : "label" }, context),
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.direction === "vertical" ? ctx.height : ctx.width);

export const toastStyleConfig: StyleConfig<ToastStackedBarChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
