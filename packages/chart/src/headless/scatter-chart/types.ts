import type { Widget } from "flitter-core";
import type { ScatterChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: ScatterChartContext<TConfig>) => Widget;

export type ScatterChartContext<TConfig = {}> = ScatterChartController & { config: TConfig };

export type ScatterChartData = {
	datasets: {
		legend: string;
		data: {
			x: number;
			y: number;
			label: string;
		}[];
	}[];
};

export type ScatterScale = {
	min: number;
	max: number;
	step: number;
};

export type ScatterChartScale = {
	x: ScatterScale;
	y: ScatterScale;
};

export type ScatterChartCustom<TConfig = {}> = {
	scatter: CustomArgs<{ label: string; legend: string; index: number }, TConfig>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	dataView: CustomArgs<{ scatters: { widget: Widget; x: number; y: number }[]; scale: ScatterChartScale }, TConfig>;
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget }, TConfig>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	dataLabel: CustomArgs<{ x: number; y: number; value: number; label: string; legend: string }, TConfig>;
	xAxisLine: CustomArgs<undefined, TConfig>;
	yAxisLine: CustomArgs<undefined, TConfig>;
	axisCorner: CustomArgs<undefined, TConfig>;
	grid: CustomArgs<{ xLine: Widget; yLine: Widget }, TConfig>;
	gridXLine: CustomArgs<undefined, TConfig>;
	gridYLine: CustomArgs<undefined, TConfig>;
};

export type ScatterChartScaleOptions = {
	roughStepCount?: number;
};

export type GetScaleFn = (data: ScatterChartData, options?: ScatterChartScaleOptions) => ScatterChartScale;
export type GetScaleOptionsFn = (context: ScatterChartController) => ScatterChartScaleOptions;
