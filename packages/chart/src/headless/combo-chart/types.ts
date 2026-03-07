import type { Widget } from "flitter-core";
import type { ComboChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: ComboChartContext<TConfig>,
) => Widget;

export type ComboChartContext<TConfig = {}> = ComboChartController & {
	config: TConfig;
};

export type ComboDataset = {
	legend: string;
	values: number[];
	type: "bar" | "line" | "area";
	yAxisId?: "primary" | "secondary";
};

export type ComboChartData = {
	labels: string[];
	datasets: ComboDataset[];
};

export type ComboAxisScale = {
	min: number;
	max: number;
	step: number;
};

export type ComboChartScale = {
	primary: ComboAxisScale;
	secondary?: ComboAxisScale;
};

export type ComboChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<
		{
			xAxis: Widget;
			yAxis: Widget;
			yAxis2: Widget;
			dataView: Widget;
			grid: Widget;
			axisCorner: Widget;
		},
		TConfig
	>;
	dataView: CustomArgs<{ bars: Widget[]; lines: Widget[]; areas: Widget[] }, TConfig>;
	bar: CustomArgs<
		{
			value: number;
			index: number;
			label: string;
			legend: string;
			datasetIndex: number;
			yAxisId: "primary" | "secondary";
		},
		TConfig
	>;
	line: CustomArgs<
		{
			values: number[];
			legend: string;
			datasetIndex: number;
			yAxisId: "primary" | "secondary";
			points: Widget[];
		},
		TConfig
	>;
	linePoint: CustomArgs<
		{
			value: number;
			index: number;
			label: string;
			legend: string;
			datasetIndex: number;
			yAxisId: "primary" | "secondary";
		},
		TConfig
	>;
	area: CustomArgs<
		{
			values: number[];
			legend: string;
			datasetIndex: number;
			yAxisId: "primary" | "secondary";
			points: Widget[];
		},
		TConfig
	>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis2: CustomArgs<{ labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxis2Label: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	xAxisLine: CustomArgs<undefined, TConfig>;
	yAxisLine: CustomArgs<undefined, TConfig>;
	grid: CustomArgs<{ xLine: Widget; yLine: Widget }, TConfig>;
	gridXLine: CustomArgs<undefined, TConfig>;
	gridYLine: CustomArgs<undefined, TConfig>;
	axisCorner: CustomArgs<undefined, TConfig>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	dataLabel: CustomArgs<{ value: number; label: string; legend: string }, TConfig>;
};
