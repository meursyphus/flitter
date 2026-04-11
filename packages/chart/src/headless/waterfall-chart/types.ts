import type { Alignment, Widget } from "flitter-core";
import type { WaterfallChartController } from "./controller";

type CustomArgs<T = undefined, TConfig extends object = object> = (
	args: T,
	context: WaterfallChartContext<TConfig>,
) => Widget;

export type WaterfallChartContext<TConfig extends object = object> = WaterfallChartController & {
	config: TConfig;
};

export type WaterfallBarType = "increase" | "decrease" | "total" | "subtotal";

export type WaterfallTotal = {
	totalType: "total" | "subtotal";
	index: number;
	axisLabel?: string;
};

export type WaterfallChartRow = Record<string, unknown>;

export type WaterfallChartData<
	TRow extends WaterfallChartRow = WaterfallChartRow,
> = {
	rows: TRow[];
	xKey: keyof TRow & string;
	yKey: keyof TRow & string;
	totals?: WaterfallTotal[];
};

export type WaterfallChartDatum<
	TRow extends WaterfallChartRow = WaterfallChartRow,
> = {
	row: TRow | null;
	label: string;
	value: number;
	cumulative: number;
	start: number;
	end: number;
	type: WaterfallBarType;
	sourceIndex: number;
};

export type WaterfallBarGeometry = {
	boxAlignment: Alignment;
	boxHeightFactor: number;
};

export type WaterfallChartScale = {
	min: number;
	max: number;
	step: number;
};

export type WaterfallChartScaleOptions = {
	roughStepCount?: number;
};

export type WaterfallChartCustom<TConfig extends object = object> = {
	barBox: CustomArgs<
		{
			bar: Widget;
			item: WaterfallChartDatum;
			geometry: WaterfallBarGeometry;
			index: number;
			isHovered: boolean;
		},
		TConfig
	>;
	bar: CustomArgs<
		{
			item: WaterfallChartDatum;
			index: number;
			isHovered: boolean;
		},
		TConfig
	>;
	connector: CustomArgs<
		{
			from: WaterfallChartDatum;
			to: WaterfallChartDatum;
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
			items: { legend: string; color: string; value: number | string }[];
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
				item: WaterfallChartDatum;
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

export type GetScaleFn = (
	data: WaterfallChartDatum[],
	options?: WaterfallChartScaleOptions,
) => WaterfallChartScale;

export type WaterfallChartGetScaleFn = GetScaleFn;

export type GetScaleOptionsFn = (
	context: WaterfallChartController,
) => WaterfallChartScaleOptions;

export type WaterfallChartGetScaleOptionsFn = GetScaleOptionsFn;
