import {
  type Widget,
  Provider,
  BuildContext,
  ChangeNotifierProvider,
} from "flitter-core";
import type {
  StackedBarChartCustom,
  StackedBarChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import { StackedBarChartController } from "./controller";
import Chart from "./chart";
import * as Default from "./default";

const STACKED_BAR_CHART_KEY = Symbol("StackedBarChartKey");

export function StackedBarChartProvider({
  custom = {},
  getScale = Default.getScale,
  getScaleOptions,
  data,
  title = "",
  direction = "vertical",
  config = {},
}: {
  custom?: Partial<StackedBarChartCustom<any>>;
  title?: string;
  data: StackedBarChartData;
  direction?: "vertical" | "horizontal";
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: any;
}): Widget {
  const defaults = {
    barGroup: Default.BarGroup,
    bar: Default.Bar,
    xAxis: Default.XAxis,
    xAxisLabel: Default.XAxisLabel,
    xAxisTick: Default.XAxisTick,
    xAxisLine: Default.XAxisLine,
    yAxis: Default.YAxis,
    yAxisLabel: Default.YAxisLabel,
    yAxisTick: Default.YAxisTick,
    yAxisLine: Default.YAxisLine,
    series: Default.Series,
    layout: Default.Layout,
    plot: Default.Plot,
    legend: Default.Legend,
    title: Default.Title,
    dataLabel: Default.DataLabel,
    grid: Default.Grid,
    gridXLine: Default.GridXLine,
    gridYLine: Default.GridYLine,
    axisCorner: Default.AxisCorner,
  };
  const mergedCustom = { ...defaults, ...custom } as StackedBarChartCustom<any>;

  return ChangeNotifierProvider({
    providerKey: STACKED_BAR_CHART_KEY,
    create: () =>
      new StackedBarChartController({
        data,
        getScale,
        getScaleOptions,
        direction,
        custom: mergedCustom,
        title,
        config,
      }),
    update: (notifier) => {
      const controller = notifier as StackedBarChartController;
      controller.data = data;
      controller.direction = direction;
      controller.custom = mergedCustom;
      controller.title = title;
      controller.config = config;
    },
    child: new Chart(),
  });
}

StackedBarChartProvider.of = (context: BuildContext): StackedBarChartController => {
  return Provider.of(STACKED_BAR_CHART_KEY, context) as StackedBarChartController;
};
