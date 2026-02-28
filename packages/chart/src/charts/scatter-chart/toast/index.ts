import type { Widget } from "flitter-core";
import HeadlessScatterChart from "@headless/scatter-chart";
import type { ScatterChartCustom, ScatterChartData, GetScaleFn, GetScaleOptionsFn } from "@headless/scatter-chart/types";
import { defaultToastConfig, type ToastScatterChartConfig } from "./config";
import { toastLayout } from "./layout";
import { toastScatter } from "./scatter";
import { toastLegend } from "./legend";
import { toastXAxisLabel } from "./x-axis-label";
import { toastYAxisLabel } from "./y-axis-label";
import { toastXAxisTick } from "./x-axis-tick";
import { toastYAxisTick } from "./y-axis-tick";
import { toastXAxisLine } from "./x-axis-line";
import { toastYAxisLine } from "./y-axis-line";
import { toastGridXLine } from "./grid-x-line";
import { toastGridYLine } from "./grid-y-line";
import { toastXAxis } from "./x-axis";
import { toastYAxis } from "./y-axis";
import { toastTitle } from "./title";
import { toastAxisCorner } from "./axis-corner";

const toastCustom: Partial<ScatterChartCustom<ToastScatterChartConfig>> = {
  layout: toastLayout,
  scatter: toastScatter,
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
  xAxis: toastXAxis,
  yAxis: toastYAxis,
};

export { type ToastScatterChartConfig } from "./config";

const DEFAULT_TICK_SPACING = 40;

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) => ({
  roughStepCount: Math.max(2, Math.floor(Math.min(ctx.width, ctx.height) / DEFAULT_TICK_SPACING)),
});

export function ToastScatterChart({
  data,
  config,
  custom,
  getScaleOptions = toastGetScaleOptions,
  ...rest
}: {
  data: ScatterChartData;
  config?: Partial<ToastScatterChartConfig>;
  custom?: Partial<ScatterChartCustom<ToastScatterChartConfig>>;
  title?: string;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const mergedConfig = { ...defaultToastConfig, ...config };
  return HeadlessScatterChart<ToastScatterChartConfig>({
    data,
    config: mergedConfig,
    custom: { ...toastCustom, ...custom },
    getScaleOptions,
    ...rest,
  });
}
