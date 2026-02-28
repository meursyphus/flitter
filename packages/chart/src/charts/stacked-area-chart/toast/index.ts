import type { Widget } from "flitter-core";
import HeadlessStackedAreaChart from "@headless/stacked-area-chart";
import type {
  StackedAreaChartCustom,
  StackedAreaChartData,
  StackedAreaChartScale,
} from "@headless/stacked-area-chart/types";
import {
  defaultToastConfig,
  type ToastStackedAreaChartConfig,
} from "./config";
import { createToastLayout } from "./layout";
import { createToastArea } from "./area";
import { createToastLegend } from "./legend";
import { createToastTitle } from "./title";
import { createToastAxisCorner } from "./axis-corner";
import { createToastXAxisLabel } from "./x-axis-label";
import { createToastYAxisLabel } from "./y-axis-label";
import { createToastXAxisTick } from "./x-axis-tick";
import { createToastYAxisTick } from "./y-axis-tick";
import { createToastXAxisLine } from "./x-axis-line";
import { createToastYAxisLine } from "./y-axis-line";
import { createToastGridXLine } from "./grid-x-line";
import { createToastGridYLine } from "./grid-y-line";
import { createToastXAxis } from "./x-axis";
import { createToastYAxis } from "./y-axis";

export { type ToastStackedAreaChartConfig } from "./config";

export function ToastStackedAreaChart({
  data,
  config,
  custom,
  ...rest
}: {
  data: StackedAreaChartData;
  config?: Partial<ToastStackedAreaChartConfig>;
  custom?: Partial<StackedAreaChartCustom>;
  title?: string;
  getScale?: (data: StackedAreaChartData) => StackedAreaChartScale;
}): Widget {
  const vc = { ...defaultToastConfig, ...config };

  const toastCustom: Partial<StackedAreaChartCustom> = {
    layout: createToastLayout(vc),
    area: createToastArea(vc),
    legend: createToastLegend(vc),
    title: createToastTitle(vc),
    axisCorner: createToastAxisCorner(vc),
    xAxisLabel: createToastXAxisLabel(vc),
    yAxisLabel: createToastYAxisLabel(vc),
    xAxisTick: createToastXAxisTick(vc),
    yAxisTick: createToastYAxisTick(vc),
    xAxisLine: createToastXAxisLine(vc),
    yAxisLine: createToastYAxisLine(vc),
    gridXLine: createToastGridXLine(vc),
    gridYLine: createToastGridYLine(vc),
    xAxis: createToastXAxis(vc),
    yAxis: createToastYAxis(vc),
  };

  return HeadlessStackedAreaChart({
    data,
    custom: { ...toastCustom, ...custom },
    ...rest,
  });
}
