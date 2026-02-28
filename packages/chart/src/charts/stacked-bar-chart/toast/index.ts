import type { BarChartCustom } from "@headless/bar-chart/types";
import type { GetScaleOptionsFn } from "@headless/bar-chart/types";
import type { StyleConfig } from "../../bar-chart/plugin";
import type { ToastStackedBarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastBar } from "../../bar-chart/toast/parts/bar";
import { toastBarGroupBox } from "../../bar-chart/toast/parts/bar-group-box";
import { toastBarBox } from "../../bar-chart/toast/parts/bar-box";
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
  toastXAxisBox,
  toastYAxisBox,
  toastScaleOptions,
} from "@shared/toast";

export { type ToastStackedBarChartConfig } from "./config";

const toastCustom: Partial<BarChartCustom<ToastStackedBarChartConfig>> = {
  layout: toastLayout as any,
  bar: toastBar as any,
  barGroupBox: toastBarGroupBox as any,
  barBox: toastBarBox as any,
  legend: toastLegend as any,
  title: toastTitle as any,
  axisCorner: toastAxisCorner as any,
  xAxisLabel: toastXAxisLabel as any,
  yAxisLabel: toastYAxisLabel as any,
  xAxisTick: toastXAxisTick as any,
  yAxisTick: toastYAxisTick as any,
  xAxisLine: toastXAxisLine as any,
  yAxisLine: toastYAxisLine as any,
  gridXLine: toastGridXLine as any,
  gridYLine: toastGridYLine as any,
  xAxis: ((args: any, context: any) =>
    toastXAxis(args, { type: context.direction === "vertical" ? "label" : "value" }, context)) as any,
  yAxis: ((args: any, context: any) =>
    toastYAxis(args, { type: context.direction === "vertical" ? "value" : "label" }, context)) as any,
  xAxisBox: toastXAxisBox as any,
  yAxisBox: toastYAxisBox as any,
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.direction === "vertical" ? ctx.height : ctx.width);

export const toastStyleConfig: StyleConfig<ToastStackedBarChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
