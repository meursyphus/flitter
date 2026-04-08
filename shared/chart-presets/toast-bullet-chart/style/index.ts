import type { BulletChartCustom, BulletChartContext, BulletChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import { type Widget } from "flitter-core";
import type { ToastBulletChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "flitter-ui/chart";
import { toastValueBar } from "./parts/value-bar";
import { toastTargetMarker } from "./parts/target-marker";
import { toastRangeBar } from "./parts/range-bar";
import { toastBulletGroup } from "./parts/bullet-group";
import { toastDataView } from "./parts/data-view";
import { toastTooltipArea } from "./parts/tooltip-area";
import {
  toastTitle,
  toastLegend,
  toastScaleOptions,
  tooltipContent,
  cartesian,
} from "../../_styles/toast/index";
import * as Cartesian from "flitter-ui/chart";

export { type ToastBulletChartConfig } from "./config";
export type { ToastBulletChartConfig as BulletChartConfig } from "./config";

function toastBulletTooltip(
  args: { label: string; items: { legend: string; color: string; value: number | string }[] },
  context: BulletChartContext<ToastBulletChartConfig>,
): Widget {
  return tooltipContent({ label: args.label, items: args.items, config: context.config });
}

const toastCustom: Partial<BulletChartCustom<ToastBulletChartConfig>> = {
  layout: cartesian.toastLayout,
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }),
  bulletGroup: toastBulletGroup,
  valueBar: toastValueBar,
  targetMarker: toastTargetMarker,
  rangeBar: toastRangeBar,
  dataView: toastDataView,
  tooltip: toastBulletTooltip,
  tooltipArea: toastTooltipArea,
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

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config: any, _direction = "horizontal") => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
