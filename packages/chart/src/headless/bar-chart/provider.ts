import {
  type Widget,
  Provider,
  BuildContext,
  ChangeNotifierProvider,
} from "flitter-core";
import type {
  BarChartCustom,
  BarChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import { BarChartController } from "./controller";
import Chart from "./chart";
import * as Default from "./default";

const BAR_CHART_KEY = Symbol("BarChartKey");

export function BarChartProvider({
  custom = {},
  getScale = Default.getScale,
  getScaleOptions,
  data,
  title = "",
  direction = "vertical",
  config = {},
}: {
  custom?: Partial<BarChartCustom<any>>;
  title?: string;
  data: BarChartData;
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
  const mergedCustom = { ...defaults, ...custom } as BarChartCustom<any>;

  return ChangeNotifierProvider({
    providerKey: BAR_CHART_KEY,
    create: () =>
      new BarChartController({
        data,
        getScale,
        getScaleOptions,
        direction,
        custom: mergedCustom,
        title,
        config,
      }),
    update: (notifier) => {
      const controller = notifier as BarChartController;
      controller.data = data;
      controller.direction = direction;
      controller.custom = mergedCustom;
      controller.title = title;
      controller.config = config;
    },
    child: new Chart(),
  });
}

BarChartProvider.of = (context: BuildContext): BarChartController => {
  return Provider.of(BAR_CHART_KEY, context) as BarChartController;
};
