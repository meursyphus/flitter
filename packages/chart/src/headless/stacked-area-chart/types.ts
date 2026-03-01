import type { Widget } from "flitter-core";
import type { StackedAreaChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: StackedAreaChartContext<TConfig>) => Widget;

export type StackedAreaChartContext<TConfig = {}> = StackedAreaChartController & { config: TConfig };

export type StackedAreaChartCustom<TConfig = {}> = {
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisBox: CustomArgs<{ child: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxisBox: CustomArgs<{ child: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	series: CustomArgs<{ areas: Widget[] }, TConfig>;
	area: CustomArgs<{
		values: number[];
		cumulativeValues: number[];
		previousCumulative: number[];
		legend: string;
		index: number;
	}, TConfig>;
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<{
		xAxis: Widget;
		yAxis: Widget;
		series: Widget;
		grid: Widget;
		axisCorner: Widget;
	}, TConfig>;
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

export type StackedAreaChartData = {
	labels: string[];
	datasets: { legend: string; values: number[] }[];
};

export type StackedAreaChartScale = {
	min: number;
	max: number;
	step: number;
};

export type StackedAreaChartScaleOptions = {
	roughStepCount?: number;
};

export type GetScaleFn = (data: StackedAreaChartData, options?: StackedAreaChartScaleOptions) => StackedAreaChartScale;
export type GetScaleOptionsFn = (context: StackedAreaChartController) => StackedAreaChartScaleOptions;
