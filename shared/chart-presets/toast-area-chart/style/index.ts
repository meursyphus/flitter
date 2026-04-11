import type { LineChartCustom } from "flitter-ui/chart";
import type { LineChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { ToastAreaChartConfig } from "./config";
import type { LineChartContext } from "flitter-ui/chart";
import type { Widget } from "flitter-ui";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { toastArea } from "./parts/area";
import { toastDataView } from "./parts/data-view";
import { toastTooltipArea } from "./parts/tooltip-area";
import {
  toastTitle,
  toastLegend,
  tooltipContent,
  toastScaleOptions,
  cartesian,
} from "../../_shared/toast/index";

export { type ToastAreaChartConfig } from "./config";

function toastTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: LineChartContext<ToastAreaChartConfig>,
): Widget {
  return tooltipContent({ label: args.label, items: args.items, config: context.config });
}

const toastCustom: Partial<LineChartCustom<ToastAreaChartConfig>> = {
  layout: cartesian.toastLayout,
  line: toastArea,
  dataView: toastDataView,
  tooltipArea: toastTooltipArea,
  legend: toastLegend,
  title: toastTitle,
  tooltip: toastTooltip,
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
