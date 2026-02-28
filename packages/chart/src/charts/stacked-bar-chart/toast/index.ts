import type { Widget } from "flitter-core";
import HeadlessStackedBarChart from "@headless/stacked-bar-chart";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "@headless/bar-chart/types";
import { defaultToastConfig, type ToastStackedBarChartConfig } from "./config";
import { toastLayout } from "./parts/layout";
import { toastBar } from "./parts/bar";
import { toastBarGroup } from "./parts/bar-group";
import { toastBarBox } from "./parts/bar-box";
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

const toastCustom: Partial<BarChartCustom<ToastStackedBarChartConfig>> = {
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

export { type ToastStackedBarChartConfig } from "./config";

const DEFAULT_TICK_SPACING = 40;

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) => {
  const axisLength = ctx.direction === "vertical" ? ctx.height : ctx.width;
  return {
    roughStepCount: axisLength > 0 ? Math.max(2, Math.floor(axisLength / DEFAULT_TICK_SPACING)) : 10,
  };
};

export function ToastStackedBarChart({
  data,
  config,
  custom,
  getScaleOptions = toastGetScaleOptions,
  ...rest
}: {
  data: BarChartData;
  config?: Partial<ToastStackedBarChartConfig>;
  custom?: Partial<BarChartCustom<ToastStackedBarChartConfig>>;
  title?: string;
  direction?: "vertical" | "horizontal";
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const mergedConfig = { ...defaultToastConfig, ...config };
  return HeadlessStackedBarChart<ToastStackedBarChartConfig>({
    data,
    config: mergedConfig,
    custom: { ...toastCustom, ...custom },
    getScaleOptions,
    ...rest,
  });
}
