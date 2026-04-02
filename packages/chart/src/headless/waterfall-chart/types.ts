import type { Widget } from "flitter-core";
import type { WaterfallChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: WaterfallChartContext<TConfig>,
) => Widget;

export type WaterfallChartContext<TConfig = {}> = WaterfallChartController & {
	config: TConfig;
};

export type WaterfallBarType = "increase" | "decrease" | "total" | "subtotal";

export type WaterfallTotal = {
	totalType: "total" | "subtotal";
	index: number;
	label?: string;
};

export type WaterfallChartData = {
	labels: string[];
	values: number[];
	totals?: WaterfallTotal[];
};

export type WaterfallChartScale = {
	min: number;
	max: number;
	step: number;
};

export type WaterfallChartCustom<TConfig = {}> = {
	bar: CustomArgs<
		{
			value: number;
			cumulative: number;
			index: number;
			label: string;
			type: WaterfallBarType;
			isHovered: boolean;
		},
		TConfig
	>;
	connector: CustomArgs<
		{
			fromCumulative: number;
			toCumulative: number;
			index: number;
		},
		TConfig
	>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	dataView: CustomArgs<{ bars: Widget[]; connectors: Widget[] }, TConfig>;
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	tooltip: CustomArgs<
		{
			label: string;
			items: { legend: string; color: string; value: number }[];
		},
		TConfig
	>;
	plot: CustomArgs<
		{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget; tooltipArea: Widget },
		TConfig
	>;
	tooltipArea: CustomArgs<
		{
			tooltip: Widget | null;
			hoveredBar: {
				index: number;
				label: string;
				value: number;
				cumulative: number;
				type: WaterfallBarType;
				x: number;
				y: number;
				width: number;
				height: number;
			} | null;
		},
		TConfig
	>;
	legend: CustomArgs<{ name: string; index: number; isVisible: boolean }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	dataLabel: CustomArgs<
		{ value: number; label: string; type: WaterfallBarType },
		TConfig
	>;
	xAxisLine: CustomArgs<undefined, TConfig>;
	yAxisLine: CustomArgs<undefined, TConfig>;
	axisCorner: CustomArgs<undefined, TConfig>;
	grid: CustomArgs<{ xLine: Widget; yLine: Widget }, TConfig>;
	gridXLine: CustomArgs<undefined, TConfig>;
	gridYLine: CustomArgs<undefined, TConfig>;
};
