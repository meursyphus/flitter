import {
  type Widget,
  Provider,
  BuildContext,
  ChangeNotifierProvider,
} from "flitter-core";
import type {
  LineChartCustom,
  LineChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import { LineChartController } from "./controller";
import Chart from "./chart";
import * as Default from "./default";

const LINE_CHART_KEY = Symbol("LineChartKey");

export function LineChartProvider({
  custom = {},
  getScale = Default.getScale,
  getScaleOptions,
  data,
  title = "",
  config = {},
}: {
  custom?: Partial<LineChartCustom<any>>;
  title?: string;
  data: LineChartData;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: any;
}): Widget {
  const defaults = {
    line: Default.Line,
    xAxis: Default.XAxis,
    xAxisBox: Default.XAxisBox,
    xAxisLabel: Default.XAxisLabel,
    xAxisTick: Default.XAxisTick,
    xAxisLine: Default.XAxisLine,
    yAxis: Default.YAxis,
    yAxisBox: Default.YAxisBox,
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
  const mergedCustom = { ...defaults, ...custom } as LineChartCustom<any>;

  return ChangeNotifierProvider({
    providerKey: LINE_CHART_KEY,
    create: () =>
      new LineChartController({
        data,
        getScale,
        getScaleOptions,
        custom: mergedCustom,
        title,
        config,
      }),
    update: (notifier) => {
      const controller = notifier as LineChartController;
      controller.data = data;
      controller.custom = mergedCustom;
      controller.title = title;
      controller.config = config;
    },
    child: new Chart(),
  });
}

LineChartProvider.of = (context: BuildContext): LineChartController => {
  return Provider.of(LINE_CHART_KEY, context) as LineChartController;
};
