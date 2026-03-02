import type { Widget, Alignment } from 'flitter-core';
import type { BarChartController } from './controller';

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: BarChartContext<TConfig>) => Widget;

export type BarChartContext<TConfig = {}> = BarChartController & { config: TConfig };

export type BarChartCustom<TConfig = {}> = {
	barGroup: CustomArgs<{ bars: { bar: Widget; value: number; datasetIndex: number }[]; index: number; label: string }, TConfig>;
	barBox: CustomArgs<{ bar: Widget; value: number; ratio: number; alignment: Alignment; index: number }, TConfig>;
	bar: CustomArgs<{ value: number; label: string; legend: string; index: number }, TConfig>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	series: CustomArgs<{ barGroups: Widget[] }, TConfig>;
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<{ xAxis: Widget; yAxis: Widget; series: Widget; grid: Widget; axisCorner: Widget }, TConfig>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	dataLabel: CustomArgs<{ value: number; label: string; legend: string }, TConfig>;
	xAxisLine: CustomArgs<undefined, TConfig>;
	yAxisLine: CustomArgs<undefined, TConfig>;
	axisCorner: CustomArgs<undefined, TConfig>;
	grid: CustomArgs<{ xLine: Widget; yLine: Widget }, TConfig>;
	gridXLine: CustomArgs<undefined, TConfig>;
	gridYLine: CustomArgs<undefined, TConfig>;
};

export type BarChartData = {
	labels: string[];
	datasets: { legend: string; values: number[] }[];
};

export type BarChartScale = {
	min: number;
	max: number;
	step: number;
};

export type BarChartDirection = 'vertical' | 'horizontal';

export type BarChartScaleOptions = {
	roughStepCount?: number;
};

export type GetScaleFn = (data: BarChartData, options?: BarChartScaleOptions) => BarChartScale;
export type GetScaleOptionsFn = (context: BarChartController) => BarChartScaleOptions;
