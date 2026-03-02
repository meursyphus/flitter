import type { Widget } from "flitter-core";
import type { RadarChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: RadarChartContext<TConfig>) => Widget;

export type RadarChartContext<TConfig = {}> = RadarChartController & { config: TConfig };

export type RadarChartData = {
	labels: string[];
	datasets: { legend: string; values: number[] }[];
};

export type RadarChartScale = {
	min: number;
	max: number;
	step: number;
};

export type RadarChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; legends: Widget[]; series: Widget }, TConfig>;
	series: CustomArgs<
		{
			grid: Widget;
			axes: Widget;
			datasets: Widget[];
			axisLabels: Widget;
		},
		TConfig
	>;
	grid: CustomArgs<{ levels: number }, TConfig>;
	axis: CustomArgs<{ index: number; label: string }, TConfig>;
	axisLabel: CustomArgs<{ index: number; label: string }, TConfig>;
	dataset: CustomArgs<
		{
			values: number[];
			legend: string;
			index: number;
		},
		TConfig
	>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
};

export type GetScaleFn = (data: RadarChartData) => RadarChartScale;
