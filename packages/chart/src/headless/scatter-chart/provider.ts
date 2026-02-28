import {
  type Widget,
  Provider,
  BuildContext,
  ChangeNotifierProvider,
} from "flitter-core";
import type {
  ScatterChartCustom,
  ScatterChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import { ScatterChartController } from "./controller";
import Chart from "./chart";
import * as Default from "./default";

const SCATTER_CHART_KEY = Symbol("ScatterChartKey");

export function ScatterChartProvider({
  custom = {},
  getScale = Default.getScale,
  getScaleOptions,
  data,
  title = "",
  config = {},
}: {
  custom?: Partial<ScatterChartCustom<any>>;
  title?: string;
  data: ScatterChartData;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: any;
}): Widget {
  const defaults = {
    scatter: Default.Scatter,
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
  const mergedCustom = { ...defaults, ...custom } as ScatterChartCustom<any>;

  return ChangeNotifierProvider({
    providerKey: SCATTER_CHART_KEY,
    create: () =>
      new ScatterChartController({
        data,
        getScale,
        getScaleOptions,
        custom: mergedCustom,
        title,
        config,
      }),
    update: (notifier) => {
      const controller = notifier as ScatterChartController;
      controller.data = data;
      controller.custom = mergedCustom;
      controller.title = title;
      controller.config = config;
    },
    child: new Chart(),
  });
}

ScatterChartProvider.of = (context: BuildContext): ScatterChartController => {
  return Provider.of(SCATTER_CHART_KEY, context) as ScatterChartController;
};
