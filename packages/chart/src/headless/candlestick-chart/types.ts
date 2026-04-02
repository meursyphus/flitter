import type { Widget } from "flitter-core";
import type { CandlestickChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: CandlestickChartContext<TConfig>,
) => Widget;

export type CandlestickChartContext<TConfig = {}> = CandlestickChartController & {
	config: TConfig;
};

export type CandlestickChartDataPoint = {
	open: number;
	high: number;
	low: number;
	close: number;
};

export type CandlestickChartData = {
	labels: string[];
	datasets: {
		legend: string;
		data: CandlestickChartDataPoint[];
	}[];
};

export type CandlestickChartScale = {
	min: number;
	max: number;
	step: number;
};

export type CandlestickChartScaleOptions = {
	roughStepCount?: number;
};

export type CandlestickChartCustom<TConfig = {}> = {
	candlestick: CustomArgs<
		{
			open: number;
			high: number;
			low: number;
			close: number;
			label: string;
			index: number;
			legend: string;
			datasetIndex: number;
			isHovered: boolean;
		},
		TConfig
	>;
	tooltip: CustomArgs<
		{
			label: string;
			items: { legend: string; color: string; value: number }[];
		},
		TConfig
	>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	dataView: CustomArgs<
		{
			candlestickGroups: {
				label: string;
				index: number;
				candlesticks: Widget[];
			}[];
		},
		TConfig
	>;
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<
		{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget },
		TConfig
	>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	dataLabel: CustomArgs<{ value: number; label: string; legend: string }, TConfig>;
	xAxisLine: CustomArgs<undefined, TConfig>;
	yAxisLine: CustomArgs<undefined, TConfig>;
	axisCorner: CustomArgs<undefined, TConfig>;
	grid: CustomArgs<{ xLine: Widget; yLine: Widget }, TConfig>;
	gridXLine: CustomArgs<undefined, TConfig>;
	gridYLine: CustomArgs<undefined, TConfig>;
};

export type GetScaleFn = (
	data: CandlestickChartData,
	options?: CandlestickChartScaleOptions,
) => CandlestickChartScale;

export type GetScaleOptionsFn = (
	context: CandlestickChartController,
) => CandlestickChartScaleOptions;
