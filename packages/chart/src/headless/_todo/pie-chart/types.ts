import type { Widget } from 'flitter-core';

type ConfigArgs<T = undefined> = (args: T, context: PieChartConfig) => Widget;

export type PieChartCustom = {
	layout: ConfigArgs<{ title: Widget; pie: Widget; legends: Widget[] }>;
	pie: ConfigArgs<{ slices: Widget[]; dataLabels: Widget[] }>;
	slice: ConfigArgs<{ index: number; label: string; value: number; percentage: number; startAngle: number; sweepAngle: number }>;
	legend: ConfigArgs<{ name: string; index: number }>;
	title: ConfigArgs<{ name: string }>;
	dataLabel: ConfigArgs<{ label: string; value: number; percentage: number; index: number }>;
};

export type PieChartData = {
	labels: string[];
	values: number[];
	title?: string;
};

export type PieChartConfig = {
	custom: PieChartCustom;
	data: PieChartData;
	title: string;
	innerRadius: number;
	colors: string[];
};
