import type { Widget } from "flitter-core";
import type { SunburstChartController } from "./controller";

type CustomArgs<T = undefined, TConfig extends object = object> = (
	args: T,
	context: SunburstChartContext<TConfig>,
) => Widget;

export type SunburstChartContext<TConfig extends object = object> = SunburstChartController & {
	config: TConfig;
};

export type SunburstChartNode = {
	label: string;
	value: number;
	children: SunburstChartNode[];
};

export type SunburstChartData = {
	nodes: SunburstChartNode[];
};

export type SunburstLegacyData = {
	root: SunburstChartNode;
};

export type SunburstResolvedNode = {
	key: string;
	path: number[];
	label: string;
	value: number;
	children: SunburstResolvedNode[];
	branchIndex: number;
	branchLabel: string;
};

export type SunburstResolvedData = {
	nodes: SunburstResolvedNode[];
};

export type FlatSegment = {
	index: number;
	key: string;
	path: number[];
	pathLabels: string[];
	label: string;
	value: number;
	depth: number;
	startAngle: number;
	sweepAngle: number;
	endAngle: number;
	branchIndex: number;
	branchLabel: string;
};

export type SunburstChartSegmentArgs = FlatSegment;

export type SunburstChartSegment = FlatSegment & {
	widget: Widget;
};

export type HoveredSunburstSegment = FlatSegment & {
	midAngle: number;
	anchorX: number;
	anchorY: number;
	directionX: number;
	directionY: number;
};

export type SunburstChartCustom<TConfig extends object = object> = {
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<{ dataView: Widget; tooltipArea: Widget }, TConfig>;
	dataView: CustomArgs<{ segments: SunburstChartSegment[] }, TConfig>;
	segment: CustomArgs<
		FlatSegment & {
			dataLabel: Widget;
			isHovered: boolean;
		},
		TConfig
	>;
	dataLabel: CustomArgs<FlatSegment & { isHovered: boolean }, TConfig>;
	legend: CustomArgs<{ name: string; index: number; isVisible: boolean }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	tooltip: CustomArgs<HoveredSunburstSegment, TConfig>;
	tooltipArea: CustomArgs<
		{
			tooltip: Widget | null;
			hoveredSegment: HoveredSunburstSegment | null;
		},
		TConfig
	>;
};

export type SunburstNode = SunburstChartNode;
export type SunburstCustom<TConfig extends object = object> = SunburstChartCustom<TConfig>;
