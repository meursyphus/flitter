import type { Widget } from "flitter-core";
import HeadlessBubbleChart from "@headless/bubble-chart";
import type { BubbleChartCustom, BubbleChartData, GetScaleFn, GetScaleOptionsFn } from "@headless/bubble-chart/types";
import { defaultToastConfig, type ToastBubbleChartConfig } from "./config";
import { toastLayout } from "./layout";
import { toastBubble } from "./bubble";
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

const toastCustom: Partial<BubbleChartCustom<ToastBubbleChartConfig>> = {
  layout: toastLayout,
  bubble: toastBubble,
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

export { type ToastBubbleChartConfig } from "./config";

const DEFAULT_TICK_SPACING = 40;

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) => {
  const axisLength = Math.min(ctx.width, ctx.height);
  return {
    roughStepCount: axisLength > 0 ? Math.max(2, Math.floor(axisLength / DEFAULT_TICK_SPACING)) : 10,
  };
};

export function ToastBubbleChart({
  data,
  config,
  custom,
  getScaleOptions = toastGetScaleOptions,
  ...rest
}: {
  data: BubbleChartData;
  config?: Partial<ToastBubbleChartConfig>;
  custom?: Partial<BubbleChartCustom<ToastBubbleChartConfig>>;
  title?: string;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const mergedConfig = { ...defaultToastConfig, ...config };
  return HeadlessBubbleChart<ToastBubbleChartConfig>({
    data,
    config: mergedConfig,
    custom: { ...toastCustom, ...custom },
    getScaleOptions,
    ...rest,
  });
}
