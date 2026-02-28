import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { StyleConfig } from "../plugin";
import type { ToastStackedAreaChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
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

const createToastCustom = (
  config: ToastStackedAreaChartConfig,
): Partial<StackedAreaChartCustom> => ({
  layout: createToastLayout(config),
  area: createToastArea(config),
  legend: createToastLegend(config),
  title: createToastTitle(config),
  axisCorner: createToastAxisCorner(config),
  xAxisLabel: createToastXAxisLabel(config),
  yAxisLabel: createToastYAxisLabel(config),
  xAxisTick: createToastXAxisTick(config),
  yAxisTick: createToastYAxisTick(config),
  xAxisLine: createToastXAxisLine(config),
  yAxisLine: createToastYAxisLine(config),
  gridXLine: createToastGridXLine(config),
  gridYLine: createToastGridYLine(config),
  xAxis: createToastXAxis(config),
  yAxis: createToastYAxis(config),
});

export const toastStyleConfig: StyleConfig<ToastStackedAreaChartConfig> = {
  custom: createToastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
};
