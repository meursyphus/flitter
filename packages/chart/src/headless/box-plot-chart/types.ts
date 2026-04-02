import type { Widget } from "flitter-core";
import type { BoxPlotChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: BoxPlotChartContext<TConfig>,
) => Widget;

export type BoxPlotChartContext<TConfig = {}> = BoxPlotChartController & {
	config: TConfig;
};

export type BoxPlotDataPoint = {
	min: number;
	q1: number;
	median: number;
	q3: number;
	max: number;
	outliers?: number[];
};

export type BoxPlotChartCustom<TConfig = {}> = {
	boxPlotGroup: CustomArgs<
		{
			boxPlots: { boxPlot: Widget; outliers: Widget[] }[];
			index: number;
			label: string;
			dataPoints: BoxPlotDataPoint[];
		},
		TConfig
	>;
	boxPlotBox: CustomArgs<
		{
			boxPlot: Widget;
			outliers: { widget: Widget; ratio: number }[];
			minRatio: number;
			maxRatio: number;
			index: number;
			datasetIndex: number;
			label: string;
			legend: string;
			isHovered: boolean;
			dataPoint: BoxPlotDataPoint;
		},
		TConfig
	>;
	boxPlot: CustomArgs<
		{
			dataPoint: BoxPlotDataPoint;
			index: number;
			legend: string;
			label: string;
			datasetIndex: number;
			isHovered: boolean;
		},
		TConfig
	>;
	outlier: CustomArgs<
		{
			value: number;
			outlierIndex: number;
			index: number;
			legend: string;
			label: string;
			datasetIndex: number;
			isHovered: boolean;
		},
		TConfig
	>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	dataView: CustomArgs<{ boxPlotGroups: Widget[] }, TConfig>;
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<
		{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget },
		TConfig
	>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	xAxisLine: CustomArgs<undefined, TConfig>;
	yAxisLine: CustomArgs<undefined, TConfig>;
	axisCorner: CustomArgs<undefined, TConfig>;
	grid: CustomArgs<{ xLine: Widget; yLine: Widget }, TConfig>;
	gridXLine: CustomArgs<undefined, TConfig>;
	gridYLine: CustomArgs<undefined, TConfig>;
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

export type BoxPlotChartDirection = "vertical" | "horizontal";

export type BoxPlotChartScaleOptions = {
	roughStepCount?: number;
};

export type GetScaleFn = (
	data: BoxPlotChartData,
	options?: BoxPlotChartScaleOptions,
) => BoxPlotChartScale;

export type GetScaleOptionsFn = (
	context: BoxPlotChartController,
) => BoxPlotChartScaleOptions;
