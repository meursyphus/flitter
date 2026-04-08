import type { Widget } from "flitter-core";
import type { PieChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: PieChartContext<TConfig>) => Widget;

export type PieChartContext<TConfig = {}> = PieChartController & { config: TConfig };

export type PieChartData = {
	datasets: { name: string; value: number }[];
};

export type PieChartSegmentArgs = {
	index: number;
	name: string;
	value: number;
	percentage: number;
	startAngle: number;
	sweepAngle: number;
};

export type PieChartSegment = {
	widget: Widget;
	startAngle: number;
	sweepAngle: number;
	percentage: number;
	index: number;
	name: string;
	value: number;
};

export type HoveredPieChartSegment = Omit<PieChartSegment, "widget"> & {
	midAngle: number;
	anchorX: number;
	anchorY: number;
	directionX: number;
	directionY: number;
};

export type PieChartRadialItem = {
	angle: number;
	tick: Widget;
	label: Widget;
};

export type PieChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<{ dataView: Widget; tooltipArea: Widget; radialItems: PieChartRadialItem[] }, TConfig>;
	dataView: CustomArgs<{ segments: PieChartSegment[] }, TConfig>;
	segment: CustomArgs<PieChartSegmentArgs & { dataLabel: Widget; isHovered: boolean }, TConfig>;
	dataLabel: CustomArgs<PieChartSegmentArgs, TConfig>;
	radialLabel: CustomArgs<{ index: number; name: string; value: number; percentage: number; angle: number; isHovered: boolean }, TConfig>;
	radialTick: CustomArgs<{ index: number; name: string; value: number; percentage: number; angle: number; isHovered: boolean }, TConfig>;
	legend: CustomArgs<{ name: string; index: number; isVisible: boolean }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	tooltip: CustomArgs<HoveredPieChartSegment, TConfig>;
	tooltipArea: CustomArgs<{ tooltip: Widget | null; hoveredSegment: HoveredPieChartSegment | null }, TConfig>;
};
