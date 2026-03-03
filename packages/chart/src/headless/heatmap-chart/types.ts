import type { Widget } from "flitter-core";
import type { HeatmapController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: HeatmapContext<TConfig>,
) => Widget;

export type HeatmapContext<TConfig = {}> = HeatmapController & { config: TConfig };

export type HeatmapCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; legend: Widget; plot: Widget }, TConfig>;
	plot: CustomArgs<
		{ xAxis: Widget; yAxis: Widget; dataView: Widget; axisCorner: Widget },
		TConfig
	>;

	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisLine: CustomArgs<undefined, TConfig>;
	yAxisLine: CustomArgs<undefined, TConfig>;
	axisCorner: CustomArgs<undefined, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;

	dataView: CustomArgs<{ segments: Widget[][] }, TConfig>;
	segment: CustomArgs<{ value: number; xIndex: number; yIndex: number }, TConfig>;

	legend: CustomArgs<undefined, TConfig>;
	title: CustomArgs<undefined, TConfig>;
};

export type HeatmapData = {
	xLabels: string[];
	yLabels: string[];
	// segments are 2-dimensional array [yIndex][xIndex]
	values: number[][];
};

export type HeatmapScale = {
	min: number;
	max: number;
};
