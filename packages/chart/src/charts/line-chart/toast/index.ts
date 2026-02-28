import type { LineChartCustom } from "@headless/line-chart/types";
import type { GetScaleOptionsFn } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "./config";
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

export { defaultToastConfig, type ToastLineChartConfig } from "./config";

export const toastCustom: Partial<LineChartCustom<ToastLineChartConfig>> = {
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

const DEFAULT_TICK_SPACING = 40;

export const toastGetScaleOptions: GetScaleOptionsFn = (ctx) => ({
  roughStepCount: ctx.height > 0 ? Math.max(2, Math.floor(ctx.height / DEFAULT_TICK_SPACING)) : 10,
});
