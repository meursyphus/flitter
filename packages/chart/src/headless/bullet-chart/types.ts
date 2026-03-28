import type { Widget } from "flitter-core";
import type { BulletChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: BulletChartContext<TConfig>) => Widget;

export type BulletChartContext<TConfig = {}> = BulletChartController & { config: TConfig };

export type BulletChartCustom<TConfig = {}> = {
  layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
  plot: CustomArgs<{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget }, TConfig>;
  dataView: CustomArgs<{ bulletGroups: Widget[] }, TConfig>;
  bulletGroup: CustomArgs<{ ranges: Widget; valueBar: Widget; targetMarker: Widget; index: number; label: string }, TConfig>;
  valueBar: CustomArgs<{ value: number; index: number; label: string }, TConfig>;
  targetMarker: CustomArgs<{ target: number; index: number; label: string }, TConfig>;
  rangeBar: CustomArgs<{ rangeValue: number; rangeIndex: number; index: number; label: string }, TConfig>;
  xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
  yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
  xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
  yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
  xAxisTick: CustomArgs<undefined, TConfig>;
  yAxisTick: CustomArgs<undefined, TConfig>;
  xAxisLine: CustomArgs<undefined, TConfig>;
  yAxisLine: CustomArgs<undefined, TConfig>;
  axisCorner: CustomArgs<undefined, TConfig>;
  grid: CustomArgs<{ xLine: Widget; yLine: Widget }, TConfig>;
  gridXLine: CustomArgs<undefined, TConfig>;
  gridYLine: CustomArgs<undefined, TConfig>;
  title: CustomArgs<undefined, TConfig>;
  legend: CustomArgs<{ name: string; index: number }, TConfig>;
  dataLabel: CustomArgs<{ value: number; label: string }, TConfig>;
};

export type BulletChartDataset = {
  value: number;
  target: number;
  ranges: number[];
};

export type BulletChartData = {
  labels: string[];
  datasets: BulletChartDataset[];
};

export type BulletChartScale = {
  min: number;
  max: number;
  step: number;
};

export type BulletChartScaleOptions = {
  roughStepCount?: number;
};

export type GetScaleFn = (data: BulletChartData, options?: BulletChartScaleOptions) => BulletChartScale;
export type GetScaleOptionsFn = (context: BulletChartController) => BulletChartScaleOptions;
