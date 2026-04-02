import type { ScatterChartCustom, ScatterChartGetScaleOptionsFn as GetScaleOptionsFn, ScatterChartContext } from "flitter-ui/chart";
import type { ToastScatterChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { toastScatter } from "./parts/scatter";
import type { Widget } from "flitter-core";
import {
  toastTitle,
  toastLegend,
  tooltipContent,
  toastScaleOptions,
  cartesian,
} from "../../_styles/toast/index";

export { type ToastScatterChartConfig } from "./config";

function toastTooltipContent(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: ScatterChartContext<ToastScatterChartConfig>,
): Widget {
  return tooltipContent({ label: args.label, items: args.items, config: context.config });
}

const toastCustom: Partial<ScatterChartCustom<ToastScatterChartConfig>> = {
  layout: cartesian.toastLayout,
  scatter: toastScatter,
  legend: (args, context) => toastLegend(args, context, { markerShape: "circle" }),
  title: toastTitle,
  tooltip: toastTooltipContent,
  axisCorner: cartesian.toastAxisCorner,
  xAxisLabel: cartesian.toastXAxisLabel,
  yAxisLabel: cartesian.toastYAxisLabel,
  xAxisTick: cartesian.toastXAxisTick,
  yAxisTick: cartesian.toastYAxisTick,
  xAxisLine: cartesian.toastXAxisLine,
  yAxisLine: cartesian.toastYAxisLine,
  gridXLine: cartesian.toastGridXLine,
  gridYLine: cartesian.toastGridYLine,
  xAxis: (args, context) => cartesian.toastXAxis(args, { type: "value" }, context),
  yAxis: (args, context) => cartesian.toastYAxis(args, { type: "value" }, context),
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(Math.min(ctx.width, ctx.height));

export const toastStyleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<ToastScatterChartConfig>) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
