import type { BarChartCustom } from "@headless/bar-chart/types";
import type { GetScaleOptionsFn } from "@headless/bar-chart/types";
import type { StyleConfig } from "../plugin";
import type { ToastBarChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastLayout } from "./parts/layout";
import { toastBar } from "./parts/bar";
import { toastBarGroupBox } from "./parts/bar-group-box";
import { toastBarBox } from "./parts/bar-box";
import { toastLegend } from "./parts/legend";
import {
  toastXAxisLabel,
  toastYAxisLabel,
  toastXAxisTick,
  toastYAxisTick,
  toastXAxisLine,
  toastYAxisLine,
  toastGridXLine,
  toastGridYLine,
  toastAxisCorner,
} from "@shared/toast";
import { toastXAxis } from "./parts/x-axis";
import { toastXAxisBox } from "./parts/x-axis-box";
import { toastYAxis } from "./parts/y-axis";
import { toastYAxisBox } from "./parts/y-axis-box";
import { toastTitle } from "./parts/title";

export { type ToastBarChartConfig } from "./config";

const toastCustom: Partial<BarChartCustom<ToastBarChartConfig>> = {
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
  xAxisBox: toastXAxisBox,
  yAxis: toastYAxis,
  yAxisBox: toastYAxisBox,
};

import { toastScaleOptions } from "@shared/toast";

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.direction === "vertical" ? ctx.height : ctx.width);

export const toastStyleConfig: StyleConfig<ToastBarChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
