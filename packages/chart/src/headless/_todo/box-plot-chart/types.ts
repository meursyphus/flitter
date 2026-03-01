import type { Widget } from 'flitter-core';

type ConfigArgs<T = undefined> = (args: T, context: BoxPlotChartConfig) => Widget;

export type BoxPlotDataPoint = {
	min: number;
	q1: number;
	median: number;
	q3: number;
	max: number;
	outliers?: number[];
};

export type BoxPlotChartCustom = {
	boxPlotGroup: ConfigArgs<{ boxPlots: Widget[]; index: number; label: string; dataPoints: BoxPlotDataPoint[] }>;
	boxPlot: ConfigArgs<{ dataPoint: BoxPlotDataPoint; index: number; legend: string; label: string }>;
	outlier: ConfigArgs<{ value: number; index: number; legend: string; label: string }>;
	xAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
	yAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
	xAxisLabel: ConfigArgs<{ name: string; index: number }>;
	yAxisLabel: ConfigArgs<{ name: string; index: number }>;
	xAxisTick: ConfigArgs;
	yAxisTick: ConfigArgs;
	series: ConfigArgs<{ boxPlotGroups: Widget[] }>;
	layout: ConfigArgs<{ title: Widget; legends: Widget[]; plot: Widget }>;
	plot: ConfigArgs<{ xAxis: Widget; yAxis: Widget; series: Widget; grid: Widget; axisCorner: Widget }>;
	legend: ConfigArgs<{ name: string; index: number }>;
	title: ConfigArgs<{ name: string }>;
	xAxisLine: ConfigArgs;
	yAxisLine: ConfigArgs;
	axisCorner: ConfigArgs;
	grid: ConfigArgs<{ xLine: Widget; yLine: Widget }>;
	gridXLine: ConfigArgs;
	gridYLine: ConfigArgs;
};

export type BoxPlotChartData = {
	labels: string[];
	datasets: {
		legend: string;
		data: BoxPlotDataPoint[];
	}[];
};

export type BoxPlotChartScale = {
	min: number;
	max: number;
	step: number;
};

export type BoxPlotChartConfig = {
	custom: BoxPlotChartCustom;
	data: BoxPlotChartData;
	scale: BoxPlotChartScale;
	title: string;
};
