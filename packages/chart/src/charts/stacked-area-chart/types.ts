import type { Widget } from "flitter-core";

type ConfigArgs<T = undefined> = (
  args: T,
  context: StackedAreaChartConfig,
) => Widget;

export type StackedAreaChartCustom = {
  xAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
  yAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
  xAxisLabel: ConfigArgs<{ name: string; index: number }>;
  yAxisLabel: ConfigArgs<{ name: string; index: number }>;
  xAxisTick: ConfigArgs;
  yAxisTick: ConfigArgs;
  series: ConfigArgs<{ areas: Widget[] }>;
  area: ConfigArgs<{
    values: number[];
    cumulativeValues: number[];
    legend: string;
    index: number;
  }>;
  layout: ConfigArgs<{ title: Widget; legends: Widget[]; plot: Widget }>;
  plot: ConfigArgs<{
    xAxis: Widget;
    yAxis: Widget;
    series: Widget;
    grid: Widget;
  }>;
  legend: ConfigArgs<{ name: string; index: number }>;
  title: ConfigArgs<{ name: string }>;
  dataLabel: ConfigArgs<{ value: number; label: string; legend: string }>;
  xAxisLine: ConfigArgs;
  yAxisLine: ConfigArgs;
  grid: ConfigArgs<{ xLine: Widget; yLine: Widget }>;
  gridXLine: ConfigArgs;
  gridYLine: ConfigArgs;
};

export type StackedAreaChartData = {
  labels: string[];
  datasets: { legend: string; values: number[] }[];
};

export type StackedAreaChartScale = {
  min: number;
  max: number;
  step: number;
};

export type StackedAreaChartConfig = {
  custom: StackedAreaChartCustom;
  data: StackedAreaChartData;
  scale: StackedAreaChartScale;
  title: string;
};
