import type { Widget } from "flitter-core";
import type { GanttChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: GanttChartContext<TConfig>,
) => Widget;

export type GanttChartContext<TConfig = {}> = GanttChartController & {
	config: TConfig;
};

export type GanttTask = {
	id: string;
	label: string;
	start: number;
	end: number;
	progress?: number;
	group?: string;
	dependencies?: string[];
};

export type GanttChartData = {
	tasks: GanttTask[];
};

export type GanttChartScale = {
	min: number;
	max: number;
	step: number;
};

export type GanttChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; plot: Widget; legends: Widget[] }, TConfig>;
	plot: CustomArgs<{ xAxis: Widget; yAxisLabels: Widget[]; dataView: Widget; grid: Widget }, TConfig>;
	dataView: CustomArgs<{ taskBars: Widget[]; dependencies: Widget[] }, TConfig>;
	taskBar: CustomArgs<
		{ task: GanttTask; index: number; startRatio: number; widthRatio: number },
		TConfig
	>;
	milestone: CustomArgs<{ task: GanttTask; index: number; startRatio: number }, TConfig>;
	dependency: CustomArgs<
		{
			fromTaskId: string;
			toTaskId: string;
			fromIndex: number;
			toIndex: number;
			fromRatio: number;
			toRatio: number;
		},
		TConfig
	>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	xAxisLine: CustomArgs<undefined, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	grid: CustomArgs<{ xLine: Widget[] }, TConfig>;
	gridXLine: CustomArgs<{ index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
};
