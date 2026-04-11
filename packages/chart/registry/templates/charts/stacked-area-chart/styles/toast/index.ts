import type { LineChartCustom } from "@headless/line-chart/types";
import type { GetScaleOptionsFn } from "@headless/line-chart/types";
import type { StyleConfig } from "../../plugin";
import type { ToastStackedAreaChartConfig } from "./config";
import type { LineChartContext } from "@headless/line-chart/types";
import type { Widget } from "flitter-core";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastArea } from "./parts/area";
import { toastDataView } from "./parts/data-view";
import { toastTooltipArea } from "./parts/tooltip-area";
import {
  toastTitle,
  toastLegend,
  tooltipContent,
  toastScaleOptions,
  cartesian,
} from "@styles/toast";

export { type ToastStackedAreaChartConfig } from "./config";

function toastTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: LineChartContext<ToastStackedAreaChartConfig>,
): Widget {
  return tooltipContent({ label: args.label, items: args.items, config: context.config });
}

const toastCustom: Partial<LineChartCustom<ToastStackedAreaChartConfig>> = {
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

export const toastStyleConfig: StyleConfig<ToastStackedAreaChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
