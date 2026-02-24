import type { Widget } from 'flitter-core';

type ConfigArgs<T = undefined> = (args: T, context: BarChartConfig) => Widget;

export type BarChartCustom = {
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
	plot: ConfigArgs<{ xAxis: Widget; yAxis: Widget; series: Widget; grid: Widget; axisCorner: Widget }>;
	legend: ConfigArgs<{ name: string; index: number }>;
	title: ConfigArgs<{ name: string }>;
	dataLabel: ConfigArgs<{ value: number; label: string; legend: string }>;
	xAxisLine: ConfigArgs;
	yAxisLine: ConfigArgs;
	axisCorner: ConfigArgs;
	grid: ConfigArgs<{ xLine: Widget; yLine: Widget }>;
	gridXLine: ConfigArgs;
	gridYLine: ConfigArgs;
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

type BarChartDirection = 'vertical' | 'horizontal';

export type BarChartConfig = {
	custom: BarChartCustom;
	data: BarChartData;
	scale: BarChartScale;
	title: string;
	direction: BarChartDirection;
};
