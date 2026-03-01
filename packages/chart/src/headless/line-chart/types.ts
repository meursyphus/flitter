import type { Widget } from "flitter-core";
import type { LineChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: LineChartContext<TConfig>) => Widget;

export type LineChartContext<TConfig = {}> = LineChartController & { config: TConfig };

export type LineChartCustom<TConfig = {}> = {
	line: CustomArgs<{ values: number[]; legend: string; index: number }, TConfig>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	series: CustomArgs<{ lines: Widget[] }, TConfig>;
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

export type LineChartData = {
	labels: string[];
	datasets: { legend: string; values: number[] }[];
};

export type LineChartScale = {
	min: number;
	max: number;
	step: number;
};

export type LineChartScaleOptions = {
	roughStepCount?: number;
};

export type GetScaleFn = (data: LineChartData, options?: LineChartScaleOptions) => LineChartScale;
export type GetScaleOptionsFn = (context: LineChartController) => LineChartScaleOptions;
