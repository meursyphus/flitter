import type { BarChartCustom } from "@headless/bar-chart/types";
import type { GetScaleOptionsFn } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { toastLayout } from "./parts/layout";
import { toastBar } from "./parts/bar";
import { toastBarGroupBox } from "./parts/bar-group-box";
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

export { defaultToastConfig, type ToastBarChartConfig } from "./config";

export const toastCustom: Partial<BarChartCustom<ToastBarChartConfig>> = {
  layout: toastLayout,
  bar: toastBar,
  barGroupBox: toastBarGroupBox,
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

const DEFAULT_TICK_SPACING = 40;

export const toastGetScaleOptions: GetScaleOptionsFn = (ctx) => {
  const axisLength = ctx.direction === "vertical" ? ctx.height : ctx.width;
  return {
    roughStepCount: axisLength > 0 ? Math.max(2, Math.floor(axisLength / DEFAULT_TICK_SPACING)) : 10,
  };
};
