import type { BarChartCustom } from "@headless/bar-chart/types";
import type { GetScaleOptionsFn } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { toastLayout } from "../../bar-chart/toast/parts/layout";
import { toastBar } from "../../bar-chart/toast/parts/bar";
import { toastBarGroupBox } from "../../bar-chart/toast/parts/bar-group-box";
import { toastBarBox } from "../../bar-chart/toast/parts/bar-box";
import { toastLegend } from "../../bar-chart/toast/parts/legend";
import { toastXAxisLabel } from "../../bar-chart/toast/parts/x-axis-label";
import { toastYAxisLabel } from "../../bar-chart/toast/parts/y-axis-label";
import { toastXAxisTick } from "../../bar-chart/toast/parts/x-axis-tick";
import { toastYAxisTick } from "../../bar-chart/toast/parts/y-axis-tick";
import { toastXAxisLine } from "../../bar-chart/toast/parts/x-axis-line";
import { toastYAxisLine } from "../../bar-chart/toast/parts/y-axis-line";
import { toastGridXLine } from "../../bar-chart/toast/parts/grid-x-line";
import { toastGridYLine } from "../../bar-chart/toast/parts/grid-y-line";
import { toastXAxis } from "../../bar-chart/toast/parts/x-axis";
import { toastYAxis } from "../../bar-chart/toast/parts/y-axis";
import { toastTitle } from "../../bar-chart/toast/parts/title";
import { toastAxisCorner } from "../../bar-chart/toast/parts/axis-corner";

export { defaultToastConfig, type ToastStackedBarChartConfig } from "./config";

export const toastCustom: Partial<BarChartCustom<ToastStackedBarChartConfig>> = {
  layout: toastLayout as any,
  bar: toastBar as any,
  barGroupBox: toastBarGroupBox as any,
  barBox: toastBarBox as any,
  legend: toastLegend as any,
  title: toastTitle as any,
  axisCorner: toastAxisCorner as any,
  xAxisLabel: toastXAxisLabel as any,
  yAxisLabel: toastYAxisLabel as any,
  xAxisTick: toastXAxisTick as any,
  yAxisTick: toastYAxisTick as any,
  xAxisLine: toastXAxisLine as any,
  yAxisLine: toastYAxisLine as any,
  gridXLine: toastGridXLine as any,
  gridYLine: toastGridYLine as any,
  xAxis: toastXAxis as any,
  yAxis: toastYAxis as any,
};

const DEFAULT_TICK_SPACING = 40;

export const toastGetScaleOptions: GetScaleOptionsFn = (ctx) => {
  const axisLength = ctx.direction === "vertical" ? ctx.height : ctx.width;
  return {
    roughStepCount: axisLength > 0 ? Math.max(2, Math.floor(axisLength / DEFAULT_TICK_SPACING)) : 10,
  };
};
