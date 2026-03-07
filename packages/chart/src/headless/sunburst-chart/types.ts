import type { Widget } from "flitter-core";
import type { SunburstChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: SunburstChartContext<TConfig>,
) => Widget;

export type SunburstChartContext<TConfig = {}> = SunburstChartController & {
	config: TConfig;
};

export type SunburstChartNode = {
	label: string;
	value?: number;
	color?: string;
	children?: SunburstChartNode[];
};

export type SunburstChartData = {
	root: SunburstChartNode;
};

export type FlatSegment = {
	node: SunburstChartNode;
	depth: number;
	startAngle: number;
	endAngle: number;
	color: string;
	path: string[];
};

export type SunburstChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; sunburst: Widget; legend: Widget }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	legend: CustomArgs<{ items: Widget[] }, TConfig>;
	legendItem: CustomArgs<{ label: string; color: string }, TConfig>;
	sunburst: CustomArgs<{ segments: FlatSegment[] }, TConfig>;
	segment: CustomArgs<{ segment: FlatSegment }, TConfig>;
};

export type SunburstNode = SunburstChartNode;
export type SunburstCustom<TConfig = {}> = SunburstChartCustom<TConfig>;
