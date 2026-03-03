import type { Widget } from "flitter-core";
import type { BubbleChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: BubbleChartContext<TConfig>) => Widget;

export type BubbleChartContext<TConfig = {}> = BubbleChartController & { config: TConfig };

export type BubbleChartData = {
	datasets: {
		legend: string;
		data: {
			x: number;
			y: number;
			value: number;
			label: string;
		}[];
	}[];
};

export type BubbleScale = {
	min: number;
	max: number;
	step: number;
};

export type BubbleChartScale = {
	x: BubbleScale;
	y: BubbleScale;
	value: BubbleScale;
};

export type BubbleChartCustom<TConfig = {}> = {
	bubble: CustomArgs<{ value: number; label: string; legend: string; index: number }, TConfig>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	dataView: CustomArgs<{ bubbles: { widget: Widget; x: number; y: number }[]; scale: BubbleChartScale }, TConfig>;
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

export type BubbleChartScaleOptions = {
	roughStepCount?: number;
};

export type GetScaleFn = (data: BubbleChartData, options?: BubbleChartScaleOptions) => BubbleChartScale;
export type GetScaleOptionsFn = (context: BubbleChartController) => BubbleChartScaleOptions;
