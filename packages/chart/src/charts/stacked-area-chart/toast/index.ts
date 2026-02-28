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
import { createToastLayout } from "./parts/layout";
import { createToastArea } from "./parts/area";
import { createToastLegend } from "./parts/legend";
import { createToastTitle } from "./parts/title";
import { createToastAxisCorner } from "./parts/axis-corner";
import { createToastXAxisLabel } from "./parts/x-axis-label";
import { createToastYAxisLabel } from "./parts/y-axis-label";
import { createToastXAxisTick } from "./parts/x-axis-tick";
import { createToastYAxisTick } from "./parts/y-axis-tick";
import { createToastXAxisLine } from "./parts/x-axis-line";
import { createToastYAxisLine } from "./parts/y-axis-line";
import { createToastGridXLine } from "./parts/grid-x-line";
import { createToastGridYLine } from "./parts/grid-y-line";
import { createToastXAxis } from "./parts/x-axis";
import { createToastYAxis } from "./parts/y-axis";

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
