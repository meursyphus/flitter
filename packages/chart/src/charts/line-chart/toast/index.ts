import type { Widget } from "flitter-core";
import HeadlessLineChart from "@headless/line-chart";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "@headless/line-chart/types";
import { defaultToastConfig, type ToastLineChartConfig } from "./config";
import { toastLayout } from "./layout";
import { toastLine } from "./line";
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

const toastCustom: Partial<LineChartCustom<ToastLineChartConfig>> = {
  layout: toastLayout,
  line: toastLine,
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

export { type ToastLineChartConfig } from "./config";

const DEFAULT_TICK_SPACING = 40;

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) => ({
  roughStepCount: ctx.height > 0 ? Math.max(2, Math.floor(ctx.height / DEFAULT_TICK_SPACING)) : 10,
});

export function ToastLineChart({
  data,
  config,
  custom,
  getScaleOptions = toastGetScaleOptions,
  ...rest
}: {
  data: LineChartData;
  config?: Partial<ToastLineChartConfig>;
  custom?: Partial<LineChartCustom<ToastLineChartConfig>>;
  title?: string;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const mergedConfig = { ...defaultToastConfig, ...config };
  return HeadlessLineChart<ToastLineChartConfig>({
    data,
    config: mergedConfig,
    custom: { ...toastCustom, ...custom },
    getScaleOptions,
    ...rest,
  });
}
