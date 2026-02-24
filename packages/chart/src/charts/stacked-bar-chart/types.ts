import type { Widget } from 'flitter-core';

type ConfigArgs<T = undefined> = (args: T, context: StackedBarChartConfig) => Widget;

export type StackedBarChartCustom = {
	barGroup: ConfigArgs<{ bars: Widget[]; index: number; label: string; values: number[] }>;
	bar: ConfigArgs<{ value: number; label: string; legend: string; index: number }>;
	xAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
	yAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
	xAxisLabel: ConfigArgs<{ name: string; index: number }>;
	yAxisLabel: ConfigArgs<{ name: string; index: number }>;
	xAxisTick: ConfigArgs;
	yAxisTick: ConfigArgs;
	series: ConfigArgs<{ barGroups: Widget[] }>;
	layout: ConfigArgs<{ title: Widget; legends: Widget[]; plot: Widget }>;
	plot: ConfigArgs<{ xAxis: Widget; yAxis: Widget; series: Widget; grid: Widget }>;
	legend: ConfigArgs<{ name: string; index: number }>;
	title: ConfigArgs<{ name: string }>;
	dataLabel: ConfigArgs<{ value: number; label: string; legend: string }>;
	xAxisLine: ConfigArgs;
	yAxisLine: ConfigArgs;
	grid: ConfigArgs<{ xLine: Widget; yLine: Widget }>;
	gridXLine: ConfigArgs;
	gridYLine: ConfigArgs;
};

export type StackedBarChartData = {
	labels: string[];
	datasets: { legend: string; values: number[] }[];
};

export type StackedBarChartScale = {
	min: number;
	max: number;
	step: number;
};

type StackedBarChartDirection = 'vertical' | 'horizontal';

export type StackedBarChartConfig = {
	custom: StackedBarChartCustom;
	data: StackedBarChartData;
	scale: StackedBarChartScale;
	title: string;
	direction: StackedBarChartDirection;
};
