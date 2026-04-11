import type { Widget } from "flitter-core";
import type { RadarChartController } from "./controller";

type CustomArgs<T = undefined, TConfig extends object = object> = (args: T, context: RadarChartContext<TConfig>) => Widget;

export type RadarChartContext<TConfig extends object = object> = RadarChartController & { config: TConfig };

export type RadarChartData = {
	labels: string[];
	datasets: { legend: string; values: number[] }[];
};

export type RadarChartScale = {
	min: number;
	max: number;
	step: number;
};

export type RadarVertex = {
	/** Normalized x position (0..1) relative to the plot area center */
	nx: number;
	/** Normalized y position (0..1) relative to the plot area center */
	ny: number;
	/** The angle in radians from 12 o'clock (top) */
	angle: number;
	/** The ratio of the value to the max scale value (0..1) */
	ratio: number;
	/** The data value */
	value: number;
	/** The axis label */
	label: string;
	/** The axis index */
	index: number;
};

export type HoveredRadar = {
	index: number;
	legend: string;
};

export type HoveredRadarPoint = {
	index: number;
	legend: string;
	pointIndex: number;
};

export type AngularItem = {
	angle: number;
	label: Widget;
};

export type RadialLabelItem = {
	ratio: number;
	value: number;
	label: Widget;
};

export type WebAngularGuide = {
	ratio: number;
	line: Widget;
};

export type WebRadialGuide = {
	angle: number;
	line: Widget;
};

export type RadarChartCustom<TConfig extends object = object> = {
	// Structure
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<{ dataView: Widget; tooltipArea: Widget; web: Widget; radialAxis: Widget; angularItems: AngularItem[] }, TConfig>;

	// Radar guides + labels
	radialAxis: CustomArgs<{ labels: RadialLabelItem[] }, TConfig>;
	web: CustomArgs<{ angularLines: WebAngularGuide[]; radialLines: WebRadialGuide[] }, TConfig>;
	angularLine: CustomArgs<{ axisCount: number }, TConfig>;
	radialLine: CustomArgs<undefined, TConfig>;
	angularAxisLabel: CustomArgs<{ index: number; label: string; angle: number }, TConfig>;
	radialAxisLabel: CustomArgs<{ value: number; index: number; ratio: number }, TConfig>;

	dataView: CustomArgs<{ radars: Widget[] }, TConfig>;
	radar: CustomArgs<{ legend: string; index: number; vertices: RadarVertex[]; isHovered: boolean; hoveredPointIndex: number | null }, TConfig>;

	// Decorations
	legend: CustomArgs<{ name: string; index: number; isVisible: boolean }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	tooltip: CustomArgs<{ label: string; items: { legend: string; color: string; value: number }[] }, TConfig>;
	tooltipArea: CustomArgs<{ hoveredRadar: HoveredRadar | null; hoveredPoint: HoveredRadarPoint | null }, TConfig>;
};

export type GetScaleFn = (data: RadarChartData) => RadarChartScale;
