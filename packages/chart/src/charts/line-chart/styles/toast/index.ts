import type { LineChartCustom } from "@headless/line-chart/types";
import type { GetScaleOptionsFn } from "@headless/line-chart/types";
import type { StyleConfig } from "../../plugin";
import type { ToastLineChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastLine } from "./parts/line";
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

export { type ToastLineChartConfig } from "./config";

const toastCustom: Partial<LineChartCustom<ToastLineChartConfig>> = {
  layout: toastLayout,
  line: toastLine,
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
  toastScaleOptions(ctx.height);

export const toastStyleConfig: StyleConfig<ToastLineChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
