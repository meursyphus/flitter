import type { LineChartCustom } from "@headless/line-chart/types";
import type { GetScaleOptionsFn } from "@headless/line-chart/types";
import type { StyleConfig } from "../../plugin";
import type { ToastAreaChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastArea } from "./parts/area";
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
  toastXAxisBox,
  toastYAxisBox,
  toastScaleOptions,
} from "@shared/styles/toast";

export { type ToastAreaChartConfig } from "./config";

const toastCustom: Partial<LineChartCustom<ToastAreaChartConfig>> = {
  layout: toastLayout,
  line: toastArea,
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
  xAxisBox: toastXAxisBox,
  yAxisBox: toastYAxisBox,
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.height);

export const toastStyleConfig: StyleConfig<ToastAreaChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
