import type { Widget } from "flitter-core";
import type { PieChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: PieChartContext<TConfig>) => Widget;

export type PieChartContext<TConfig = {}> = PieChartController & { config: TConfig };

export type PieChartData = {
	datasets: { name: string; value: number }[];
};

export type PieChartSliceArgs = {
	index: number;
	name: string;
	value: number;
	percentage: number;
	startAngle: number;
	sweepAngle: number;
};

export type PieChartSlice = {
	widget: Widget;
	startAngle: number;
	sweepAngle: number;
	percentage: number;
	index: number;
	name: string;
	value: number;
};

export type HoveredPieSlice = Omit<PieChartSlice, "widget"> & {
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
	dataView: CustomArgs<{ slices: PieChartSlice[] }, TConfig>;
	slice: CustomArgs<PieChartSliceArgs & { dataLabel: Widget }, TConfig>;
	dataLabel: CustomArgs<PieChartSliceArgs, TConfig>;
	radialLabel: CustomArgs<{ index: number; name: string; value: number; percentage: number; angle: number }, TConfig>;
	radialTick: CustomArgs<{ index: number; name: string; value: number; percentage: number; angle: number }, TConfig>;
	legend: CustomArgs<{ name: string; index: number; isVisible: boolean }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	tooltip: CustomArgs<HoveredPieSlice, TConfig>;
	tooltipArea: CustomArgs<{ tooltip: Widget | null; hoveredSlice: HoveredPieSlice | null }, TConfig>;
};
