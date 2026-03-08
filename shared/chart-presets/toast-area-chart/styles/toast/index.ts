import type { LineChartCustom } from "../../../_flitter/headless/line-chart";
import type { GetScaleOptionsFn } from "../../../_flitter/headless/line-chart";
import type { ToastAreaChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "../../../_flitter/shared/utils/index";
import { toastArea } from "./parts/area";
import { toastDataView } from "./parts/data-view";
import {
  toastTitle,
  toastLegend,
  toastScaleOptions,
  cartesian,
} from "../../../toast-base/index";

export { type ToastAreaChartConfig } from "./config";

const toastCustom: Partial<LineChartCustom<ToastAreaChartConfig>> = {
  layout: cartesian.toastLayout,
  line: toastArea,
  dataView: toastDataView,
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
    cartesian.toastXAxis(args, { type: "value" }, context),
  yAxis: (args, context) =>
    cartesian.toastYAxis(args, { type: "value" }, context),
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.height);

export const toastStyleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<ToastAreaChartConfig>) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
