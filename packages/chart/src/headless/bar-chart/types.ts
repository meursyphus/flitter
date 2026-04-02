import type { Widget, Alignment } from 'flitter-core';
import type { BarChartController } from './controller';

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: BarChartContext<TConfig>) => Widget;

export type BarChartContext<TConfig = {}> = BarChartController & { config: TConfig };

export type BarChartCustom<TConfig = {}> = {
	barGroup: CustomArgs<{ bars: { bar: Widget; value: number; datasetIndex: number }[]; index: number; label: string }, TConfig>;
	barBox: CustomArgs<{ bar: Widget; value: number; ratio: number; alignment: Alignment; index: number; label: string; legend: string; isHovered: boolean }, TConfig>;
	bar: CustomArgs<{ value: number; label: string; legend: string; index: number; isHovered: boolean }, TConfig>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	dataView: CustomArgs<{ barGroups: Widget[] }, TConfig>;
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
		hoveredBar: {
			index: number;
			legend: string;
			value: number;
			label: string;
			x: number;
			y: number;
			width: number;
			height: number;
		} | null;
	}, TConfig>;
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
