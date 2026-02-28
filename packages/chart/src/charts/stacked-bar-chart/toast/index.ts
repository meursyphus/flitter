import type { BarChartCustom } from "@headless/bar-chart/types";
import type { GetScaleOptionsFn } from "@headless/bar-chart/types";
import type { StyleConfig } from "../../bar-chart/plugin";
import type { ToastStackedBarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastLayout } from "../../bar-chart/toast/parts/layout";
import { toastBar } from "../../bar-chart/toast/parts/bar";
import { toastBarGroupBox } from "../../bar-chart/toast/parts/bar-group-box";
import { toastBarBox } from "../../bar-chart/toast/parts/bar-box";
import { toastLegend } from "../../bar-chart/toast/parts/legend";
import {
  toastXAxisLabel,
  toastYAxisLabel,
  toastXAxisTick,
  toastYAxisTick,
  toastXAxisLine,
  toastYAxisLine,
  toastGridXLine,
  toastGridYLine,
  toastAxisCorner,
} from "@shared/toast";
import { toastXAxis } from "../../bar-chart/toast/parts/x-axis";
import { toastXAxisBox } from "../../bar-chart/toast/parts/x-axis-box";
import { toastYAxis } from "../../bar-chart/toast/parts/y-axis";
import { toastYAxisBox } from "../../bar-chart/toast/parts/y-axis-box";
import { toastTitle } from "../../bar-chart/toast/parts/title";

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
  xAxis: toastXAxis as any,
  xAxisBox: toastXAxisBox as any,
  yAxis: toastYAxis as any,
  yAxisBox: toastYAxisBox as any,
};

import { toastScaleOptions } from "@shared/toast";

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.direction === "vertical" ? ctx.height : ctx.width);

export const toastStyleConfig: StyleConfig<ToastStackedBarChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
