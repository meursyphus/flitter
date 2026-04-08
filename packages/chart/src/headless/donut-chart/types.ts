import type { Widget } from "flitter-core";
import type { DonutChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: DonutChartContext<TConfig>,
) => Widget;

export type DonutChartContext<TConfig = {}> = DonutChartController & {
	config: TConfig;
};

export type DonutChartData = {
	datasets: { name: string; value: number }[];
};

export type DonutChartSegmentArgs = {
	index: number;
	name: string;
	value: number;
	percentage: number;
	startAngle: number;
	sweepAngle: number;
};

export type DonutChartSegment = {
	widget: Widget;
	startAngle: number;
	sweepAngle: number;
	percentage: number;
	index: number;
	name: string;
	value: number;
};

export type HoveredDonutChartSegment = Omit<DonutChartSegment, "widget"> & {
	midAngle: number;
	anchorX: number;
	anchorY: number;
	directionX: number;
	directionY: number;
};

export type DonutChartRadialItem = {
	angle: number;
	tick: Widget;
	label: Widget;
};

export type DonutChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<{ dataView: Widget; tooltipArea: Widget; radialItems: DonutChartRadialItem[] }, TConfig>;
	dataView: CustomArgs<{ segments: DonutChartSegment[]; dataCenter: Widget }, TConfig>;
	segment: CustomArgs<DonutChartSegmentArgs & { dataLabel: Widget; isHovered: boolean }, TConfig>;
	dataLabel: CustomArgs<DonutChartSegmentArgs, TConfig>;
	radialLabel: CustomArgs<{ index: number; name: string; value: number; percentage: number; angle: number; isHovered: boolean }, TConfig>;
	radialTick: CustomArgs<{ index: number; name: string; value: number; percentage: number; angle: number; isHovered: boolean }, TConfig>;
	legend: CustomArgs<{ name: string; index: number; isVisible: boolean }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	dataCenter: CustomArgs<{
		total: number;
		hoveredSegment: DonutChartSegmentArgs | null;
	}, TConfig>;
	tooltip: CustomArgs<HoveredDonutChartSegment, TConfig>;
	tooltipArea: CustomArgs<{ tooltip: Widget | null; hoveredSegment: HoveredDonutChartSegment | null }, TConfig>;
};
