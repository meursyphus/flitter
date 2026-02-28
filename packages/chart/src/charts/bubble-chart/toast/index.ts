import type { Widget } from "flitter-core";
import HeadlessBubbleChart from "@headless/bubble-chart";
import type { BubbleChartCustom, BubbleChartData, GetScaleFn, GetScaleOptionsFn } from "@headless/bubble-chart/types";
import { defaultToastConfig, type ToastBubbleChartConfig } from "./config";
import { toastLayout } from "./parts/layout";
import { toastBubble } from "./parts/bubble";
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
