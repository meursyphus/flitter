import type { Widget } from "flitter-core";
import HeadlessLineChart from "@headless/line-chart";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "@headless/line-chart/types";
import { defaultToastConfig, type ToastLineChartConfig } from "./config";
import { toastLayout } from "./parts/layout";
import { toastLine } from "./parts/line";
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
