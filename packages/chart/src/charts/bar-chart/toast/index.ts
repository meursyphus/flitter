import type { Widget } from "flitter-core";
import HeadlessBarChart from "@headless/bar-chart";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "@headless/bar-chart/types";
import { defaultToastConfig, type ToastBarChartConfig } from "./config";
import { toastLayout } from "./layout";
import { toastBar } from "./bar";
import { toastBarGroup } from "./bar-group";
import { toastBarBox } from "./bar-box";
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

const toastCustom: Partial<BarChartCustom<ToastBarChartConfig>> = {
  layout: toastLayout,
  bar: toastBar,
  barGroup: toastBarGroup,
  barBox: toastBarBox,
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

export { type ToastBarChartConfig } from "./config";

const DEFAULT_TICK_SPACING = 40;

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) => {
  const axisLength = ctx.direction === "vertical" ? ctx.height : ctx.width;
  return {
    roughStepCount: axisLength > 0 ? Math.max(2, Math.floor(axisLength / DEFAULT_TICK_SPACING)) : 10,
  };
};

export function ToastBarChart({
  data,
  config,
  custom,
  getScaleOptions = toastGetScaleOptions,
  ...rest
}: {
  data: BarChartData;
  config?: Partial<ToastBarChartConfig>;
  custom?: Partial<BarChartCustom<ToastBarChartConfig>>;
  title?: string;
  direction?: "vertical" | "horizontal";
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const mergedConfig = { ...defaultToastConfig, ...config };
  return HeadlessBarChart<ToastBarChartConfig>({
    data,
    config: mergedConfig,
    custom: { ...toastCustom, ...custom },
    getScaleOptions,
    ...rest,
  });
}
