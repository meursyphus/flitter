import type { Widget } from 'flitter-core';

type ConfigArgs<T = undefined> = (args: T, context: WaterfallChartConfig) => Widget;

export type WaterfallChartCustom = {
	bar: ConfigArgs<{ value: number; cumulative: number; index: number; label: string; type: 'increase' | 'decrease' | 'total' }>;
	connector: ConfigArgs<{ fromCumulative: number; toCumulative: number; index: number }>;
	xAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
	yAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
	xAxisLabel: ConfigArgs<{ name: string; index: number }>;
	yAxisLabel: ConfigArgs<{ name: string; index: number }>;
	xAxisTick: ConfigArgs;
	yAxisTick: ConfigArgs;
	series: ConfigArgs<{ bars: Widget[]; connectors: Widget[] }>;
	layout: ConfigArgs<{ title: Widget; legends: Widget[]; plot: Widget }>;
	plot: ConfigArgs<{ xAxis: Widget; yAxis: Widget; series: Widget; grid: Widget; axisCorner: Widget }>;
	legend: ConfigArgs<{ name: string; index: number }>;
	title: ConfigArgs<{ name: string }>;
	dataLabel: ConfigArgs<{ value: number; label: string; type: 'increase' | 'decrease' | 'total' }>;
	xAxisLine: ConfigArgs;
	yAxisLine: ConfigArgs;
	axisCorner: ConfigArgs;
	grid: ConfigArgs<{ xLine: Widget; yLine: Widget }>;
	gridXLine: ConfigArgs;
	gridYLine: ConfigArgs;
};

export type WaterfallChartData = {
	labels: string[];
	values: number[];
	totalIndices?: number[];
	title?: string;
};

export type WaterfallChartScale = {
	min: number;
	max: number;
	step: number;
};

export type WaterfallChartConfig = {
	custom: WaterfallChartCustom;
	data: WaterfallChartData;
	scale: WaterfallChartScale;
	title: string;
	cumulativeValues: number[];
};
