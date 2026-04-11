import type { Widget } from "flitter-core";
import type { HeatmapController } from "./controller";

type CustomArgs<T = undefined, TConfig extends object = object> = (
	args: T,
	context: HeatmapContext<TConfig>,
) => Widget;

export type HeatmapContext<TConfig extends object = object> = HeatmapController & { config: TConfig };

export type HeatmapHoveredSegment = {
	value: number;
	xIndex: number;
	yIndex: number;
	xLabel: string;
	yLabel: string;
};

export type HeatmapHoveredSegmentRect = HeatmapHoveredSegment & {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type HeatmapCustom<TConfig extends object = object> = {
	layout: CustomArgs<{ title: Widget; legend: Widget; plot: Widget }, TConfig>;
	plot: CustomArgs<
		{
			xAxis: Widget;
			yAxis: Widget;
			dataView: Widget;
			axisCorner: Widget;
			tooltipArea: Widget;
		},
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
	segment: CustomArgs<{ value: number; xIndex: number; yIndex: number; isHovered: boolean }, TConfig>;

	legend: CustomArgs<undefined, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	tooltip: CustomArgs<{ label: string; items: { legend: string; color: string; value: number }[] }, TConfig>;
	tooltipArea: CustomArgs<
		{
			tooltip: Widget | null;
			hoveredSegment: HeatmapHoveredSegmentRect | null;
		},
		TConfig
	>;
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
