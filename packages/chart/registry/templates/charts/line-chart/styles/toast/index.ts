import type { LineChartCustom } from "@headless/line-chart/types";
import type { GetScaleOptionsFn } from "@headless/line-chart/types";
import type { StyleConfig } from "../../plugin";
import type { ToastLineChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastLine } from "./parts/line";
import { toastDataView } from "./parts/data-view";
import {
  toastTitle,
  toastLegend,
  tooltipContent,
  toastScaleOptions,
  cartesian,
} from "@styles/toast";
import type { LineChartContext } from "@headless/line-chart/types";
import type { Widget } from "flitter-core";

export { type ToastLineChartConfig } from "./config";

function toastTooltipContent(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: LineChartContext<ToastLineChartConfig>,
): Widget {
  return tooltipContent({ label: args.label, items: args.items, config: context.config });
}

const toastCustom: Partial<LineChartCustom<ToastLineChartConfig>> = {
  layout: cartesian.toastLayout,
  line: toastLine,
  dataView: toastDataView,
  legend: toastLegend,
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
  xAxis: (args, context) =>
    cartesian.toastXAxis(args, { type: "value" }, context),
  yAxis: (args, context) =>
    cartesian.toastYAxis(args, { type: "value" }, context),
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.height);

export const toastStyleConfig: StyleConfig<ToastLineChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
