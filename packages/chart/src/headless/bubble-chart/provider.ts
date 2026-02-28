import {
  type Widget,
  Provider,
  BuildContext,
  ChangeNotifierProvider,
} from "flitter-core";
import type {
  BubbleChartCustom,
  BubbleChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import { BubbleChartController } from "./controller";
import Chart from "./chart";
import * as Default from "./default";

const BUBBLE_CHART_KEY = Symbol("BubbleChartKey");

export function BubbleChartProvider({
  custom = {},
  getScale = Default.getScale,
  getScaleOptions,
  data,
  title = "",
  config = {},
}: {
  custom?: Partial<BubbleChartCustom<any>>;
  title?: string;
  data: BubbleChartData;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: any;
}): Widget {
  const defaults = {
    bubble: Default.Bubble,
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
  const mergedCustom = { ...defaults, ...custom } as BubbleChartCustom<any>;

  return ChangeNotifierProvider({
    providerKey: BUBBLE_CHART_KEY,
    create: () =>
      new BubbleChartController({
        data,
        getScale,
        getScaleOptions,
        custom: mergedCustom,
        title,
        config,
      }),
    update: (notifier) => {
      const controller = notifier as BubbleChartController;
      controller.data = data;
      controller.custom = mergedCustom;
      controller.title = title;
      controller.config = config;
    },
    child: new Chart(),
  });
}

BubbleChartProvider.of = (context: BuildContext): BubbleChartController => {
  return Provider.of(BUBBLE_CHART_KEY, context) as BubbleChartController;
};
