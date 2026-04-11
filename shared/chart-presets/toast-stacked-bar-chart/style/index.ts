import type { BarChartCustom } from "flitter-ui/chart";
import type { BarChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { ToastStackedBarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { toastBar } from "./parts/bar";
import { toastDataView } from "./parts/data-view";
import { toastBarBox } from "./parts/bar-box";
import { toastTooltipArea } from "./parts/tooltip-area";
import {
  toastTitle,
  toastLegend,
  tooltipContent,
  toastScaleOptions,
  cartesian,
} from "../../_shared/toast/index";
import type { BarChartContext } from "flitter-ui/chart";
import type { Widget } from "flitter-ui";

export { type ToastStackedBarChartConfig } from "./config";

function toastTooltipContent(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: BarChartContext<ToastStackedBarChartConfig>,
): Widget {
  return tooltipContent({ label: args.label, items: args.items, config: context.config });
}

const toastCustom: Partial<BarChartCustom<ToastStackedBarChartConfig>> = {
  layout: cartesian.toastLayout,
  bar: toastBar,
  dataView: toastDataView,
  barBox: toastBarBox,
  legend: toastLegend,
  title: toastTitle,
  tooltip: toastTooltipContent,
  tooltipArea: toastTooltipArea,
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
