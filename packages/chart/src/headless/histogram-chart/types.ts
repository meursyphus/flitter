import type { Alignment, Widget } from "flitter-core";
import type { HistogramChartController } from "./controller";

type CustomArgs<T = undefined, TConfig extends object = object> = (
	args: T,
	context: HistogramChartContext<TConfig>,
) => Widget;

export type HistogramChartContext<TConfig extends object = object> = HistogramChartController & {
	config: TConfig;
};

export type HistogramAggregation =
	| "count"
	| "density"
	| "sum"
	| "mean"
	| "min"
	| "max";

export type HistogramChartRow = Record<string, unknown>;

export type HistogramChartValueData = {
	values: number[];
};

export type HistogramChartRowData<
	TRow extends HistogramChartRow = HistogramChartRow,
> = {
	rows: TRow[];
	xKey: keyof TRow & string;
	yKey?: keyof TRow & string;
};

export type HistogramChartData<
	TRow extends HistogramChartRow = HistogramChartRow,
> = HistogramChartValueData | HistogramChartRowData<TRow>;

export type HistogramChartTransform = {
	binCount?: number;
	bins?: [number, number][];
	aggregation?: HistogramAggregation;
};

export type HistogramBin = {
	min: number;
	max: number;
	count: number;
	label: string;
	value: number;
	density: number;
	sum: number;
	mean: number | null;
	minValue: number | null;
	maxValue: number | null;
};

export type HistogramChartScale = {
	min: number;
	max: number;
	step: number;
};

export type HistogramChartCustom<TConfig extends object = object> = {
	layout: CustomArgs<{ title: Widget; plot: Widget }, TConfig>;
	plot: CustomArgs<
		{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget; tooltipArea: Widget },
		TConfig
	>;
	dataView: CustomArgs<{ bars: Widget[] }, TConfig>;
	barBox: CustomArgs<{
		bar: Widget;
		bin: HistogramBin;
		index: number;
		ratio: number;
		alignment: Alignment;
		isHovered: boolean;
	}, TConfig>;
	bar: CustomArgs<{ bin: HistogramBin; index: number; isHovered: boolean }, TConfig>;
	tooltip: CustomArgs<{ label: string; items: { legend: string; color: string; value: number }[] }, TConfig>;
	tooltipArea: CustomArgs<{
		tooltip: Widget | null;
		hoveredBin: (HistogramBin & {
			index: number;
			x: number;
			y: number;
			width: number;
			height: number;
		}) | null;
	}, TConfig>;
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
	dataLabel: CustomArgs<{ bin: HistogramBin; index: number }, TConfig>;
};
