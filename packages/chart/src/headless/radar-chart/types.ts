import type { Widget } from "flitter-core";

type ConfigArgs<T = undefined> = (args: T, context: RadarChartConfig) => Widget;

export type RadarChartCustom = {
  layout: ConfigArgs<{ title: Widget; legends: Widget[]; radar: Widget }>;
  radar: ConfigArgs<{
    grid: Widget;
    axes: Widget;
    datasets: Widget;
    axisLabels: Widget;
  }>;
  grid: ConfigArgs<{ levels: number }>;
  axis: ConfigArgs<{ index: number; label: string }>;
  axisLabel: ConfigArgs<{ index: number; label: string }>;
  dataset: ConfigArgs<{
    values: number[];
    legend: string;
    index: number;
  }>;
  legend: ConfigArgs<{ name: string; index: number }>;
  title: ConfigArgs<{ name: string }>;
};

export type RadarChartData = {
  labels: string[];
  datasets: { legend: string; values: number[] }[];
  title?: string;
};

export type RadarChartScale = {
  min: number;
  max: number;
  step: number;
};

export type RadarChartConfig = {
  custom: RadarChartCustom;
  data: RadarChartData;
  scale: RadarChartScale;
  title: string;
};
