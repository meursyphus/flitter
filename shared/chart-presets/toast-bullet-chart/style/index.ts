import type { BulletChartCustom, BulletChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { ToastBulletChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "flitter-ui/chart";
import { toastValueBar } from "./parts/value-bar";
import { toastTargetMarker } from "./parts/target-marker";
import { toastRangeBar } from "./parts/range-bar";
import { toastBulletGroup } from "./parts/bullet-group";
import { toastDataView } from "./parts/data-view";
import {
  toastTitle,
  toastLegend,
  toastScaleOptions,
  cartesian,
} from "../../_styles/toast/index";
import * as Cartesian from "flitter-ui/chart";

export { type ToastBulletChartConfig } from "./config";
export type { ToastBulletChartConfig as BulletChartConfig } from "./config";

const toastCustom: Partial<BulletChartCustom<ToastBulletChartConfig>> = {
  layout: cartesian.toastLayout,
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  bulletGroup: toastBulletGroup,
  valueBar: toastValueBar,
  targetMarker: toastTargetMarker,
  rangeBar: toastRangeBar,
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
  // Bullet chart is always horizontal: X = value, Y = label
  xAxis: (args, context) =>
    cartesian.toastXAxis(args, { type: "value" }, context),
  yAxis: (args, context) =>
    cartesian.toastYAxis(args, { type: "label" }, context),
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.width);

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config: any) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
