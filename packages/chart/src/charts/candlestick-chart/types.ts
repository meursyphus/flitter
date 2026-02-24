import type { Widget } from 'flitter-core';

type ConfigArgs<T = undefined> = (args: T, context: CandlestickChartConfig) => Widget;

export type CandlestickChartCustom = {
	candlestick: ConfigArgs<{
		open: number;
		high: number;
		low: number;
		close: number;
		label: string;
		index: number;
	}>;
	xAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
	yAxis: ConfigArgs<{ line: Widget; labels: Widget[]; tick: Widget }>;
	xAxisLabel: ConfigArgs<{ name: string; index: number }>;
	yAxisLabel: ConfigArgs<{ name: string; index: number }>;
	xAxisTick: ConfigArgs;
	yAxisTick: ConfigArgs;
	series: ConfigArgs<{ candlesticks: Widget[] }>;
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

export type CandlestickChartDataPoint = {
	open: number;
	high: number;
	low: number;
	close: number;
};

export type CandlestickChartData = {
	labels: string[];
	datasets: CandlestickChartDataPoint[];
	title?: string;
};

export type CandlestickChartScale = {
	min: number;
	max: number;
	step: number;
};

export type CandlestickChartConfig = {
	custom: CandlestickChartCustom;
	data: CandlestickChartData;
	scale: CandlestickChartScale;
	title: string;
};
