import type { Widget } from "flitter-core";
import type { HistogramChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: HistogramChartContext<TConfig>,
) => Widget;

export type HistogramChartContext<TConfig = {}> = HistogramChartController & {
	config: TConfig;
};

export type HistogramBin = {
	min: number;
	max: number;
	count: number;
	label: string;
};

export type HistogramChartData =
	| {
			values: number[];
			binCount?: number;
	  }
	| {
			bins: { min: number; max: number; count: number }[];
	  };

export type HistogramChartScale = {
	min: number;
	max: number;
	step: number;
};

export type HistogramChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; plot: Widget }, TConfig>;
	plot: CustomArgs<
		{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget },
		TConfig
	>;
	dataView: CustomArgs<{ bars: Widget[] }, TConfig>;
	bar: CustomArgs<{ binMin: number; binMax: number; count: number; index: number }, TConfig>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	xAxisLine: CustomArgs<undefined, TConfig>;
	yAxisLine: CustomArgs<undefined, TConfig>;
	grid: CustomArgs<{ xLine: Widget; yLine: Widget }, TConfig>;
	gridXLine: CustomArgs<undefined, TConfig>;
	gridYLine: CustomArgs<undefined, TConfig>;
	axisCorner: CustomArgs<undefined, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	dataLabel: CustomArgs<{ count: number; index: number }, TConfig>;
};
