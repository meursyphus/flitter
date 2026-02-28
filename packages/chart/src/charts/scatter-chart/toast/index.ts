import type { Widget } from "flitter-core";
import HeadlessScatterChart from "@headless/scatter-chart";
import type { ScatterChartCustom, ScatterChartData, GetScaleFn, GetScaleOptionsFn } from "@headless/scatter-chart/types";
import { defaultToastConfig, type ToastScatterChartConfig } from "./config";
import { toastLayout } from "./parts/layout";
import { toastScatter } from "./parts/scatter";
import { toastLegend } from "./parts/legend";
import { toastXAxisLabel } from "./parts/x-axis-label";
import { toastYAxisLabel } from "./parts/y-axis-label";
import { toastXAxisTick } from "./parts/x-axis-tick";
import { toastYAxisTick } from "./parts/y-axis-tick";
import { toastXAxisLine } from "./parts/x-axis-line";
import { toastYAxisLine } from "./parts/y-axis-line";
import { toastGridXLine } from "./parts/grid-x-line";
import { toastGridYLine } from "./parts/grid-y-line";
import { toastXAxis } from "./parts/x-axis";
import { toastYAxis } from "./parts/y-axis";
import { toastTitle } from "./parts/title";
import { toastAxisCorner } from "./parts/axis-corner";

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
