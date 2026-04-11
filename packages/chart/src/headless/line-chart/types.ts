import type { Widget } from "flitter-core";
import type { LineChartController } from "./controller";

type CustomArgs<T = undefined, TConfig extends object = object> = (args: T, context: LineChartContext<TConfig>) => Widget;

export type LineChartContext<TConfig extends object = object> = LineChartController & { config: TConfig };
export type HoveredLinePoint = {
	index: number;
	legend: string;
};

export type GetPointValueFn = (args: {
	data: LineChartData;
	index: number;
	legend: string;
}) => number | null;

export type LineChartGetPointValueFn = GetPointValueFn;

export type LineChartCustom<TConfig extends object = object> = {
	line: CustomArgs<{ values: number[]; legend: string; index: number; isHovered: boolean }, TConfig>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	dataView: CustomArgs<{ lines: Widget[] }, TConfig>;
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget; tooltipArea: Widget }, TConfig>;
	legend: CustomArgs<{ name: string; index: number; isVisible: boolean }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	dataLabel: CustomArgs<{ value: number; label: string; legend: string }, TConfig>;
	xAxisLine: CustomArgs<undefined, TConfig>;
	yAxisLine: CustomArgs<undefined, TConfig>;
	axisCorner: CustomArgs<undefined, TConfig>;
	grid: CustomArgs<{ xLine: Widget; yLine: Widget }, TConfig>;
	gridXLine: CustomArgs<undefined, TConfig>;
	gridYLine: CustomArgs<undefined, TConfig>;
	tooltip: CustomArgs<{ label: string; items: { legend: string; color: string; value: number }[] }, TConfig>;
	tooltipArea: CustomArgs<{
		tooltip: Widget | null;
		hoveredPoint: HoveredLinePoint | null;
	}, TConfig>;
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
