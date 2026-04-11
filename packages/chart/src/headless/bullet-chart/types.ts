import type { Widget } from "flitter-core";
import type { BulletChartController } from "./controller";

type CustomArgs<T = undefined, TConfig extends object = object> = (args: T, context: BulletChartContext<TConfig>) => Widget;

export type BulletChartContext<TConfig extends object = object> = BulletChartController & { config: TConfig };

export type BulletChartCustom<TConfig extends object = object> = {
  layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
  plot: CustomArgs<{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget; tooltipArea: Widget }, TConfig>;
  dataView: CustomArgs<{ bulletGroups: Widget[] }, TConfig>;
  bulletGroup: CustomArgs<{ bulletBox: Widget; index: number; label: string; isHovered: boolean; isDimmed: boolean }, TConfig>;
  bulletBox: CustomArgs<{
    ranges: { widget: Widget; ratio: number }[];
    valueBar: Widget;
    valueRatio: number;
    targetMarker: Widget;
    targetRatio: number;
    tooltipAnchor: Widget;
    index: number;
    label: string;
    value: number;
    target: number;
    rangeValues: number[];
    isHovered: boolean;
    isDimmed: boolean;
  }, TConfig>;
  valueBar: CustomArgs<{ value: number; index: number; label: string; isHovered: boolean; isDimmed: boolean }, TConfig>;
  targetMarker: CustomArgs<{ target: number; index: number; label: string; isHovered: boolean; isDimmed: boolean }, TConfig>;
  rangeBar: CustomArgs<{ rangeValue: number; rangeIndex: number; index: number; label: string; isHovered: boolean; isDimmed: boolean }, TConfig>;
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
  tooltip: CustomArgs<{ label: string; items: { legend: string; color: string; value: number | string }[] }, TConfig>;
  tooltipArea: CustomArgs<{
    tooltip: Widget | null;
    hoveredBullet: {
      index: number;
      label: string;
      value: number;
      target: number;
      ranges: number[];
      x: number;
      y: number;
      width: number;
      height: number;
    } | null;
  }, TConfig>;
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

export type BulletChartDirection = "vertical" | "horizontal";

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
