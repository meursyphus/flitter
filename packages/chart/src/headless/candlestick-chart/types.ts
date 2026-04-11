import type { Alignment, Widget } from "flitter-core";
import type { CandlestickChartController } from "./controller";

type CustomArgs<T = undefined, TConfig extends object = object> = (
	args: T,
	context: CandlestickChartContext<TConfig>,
) => Widget;

export type CandlestickChartContext<TConfig extends object = object> = CandlestickChartController & {
	config: TConfig;
};

export type CandlestickChartRow = Record<string, unknown> & {
	open: number;
	high: number;
	low: number;
	close: number;
};

export type CandlestickChartData<
	TRow extends CandlestickChartRow = CandlestickChartRow,
> = {
	rows: TRow[];
	xKey: keyof TRow & string;
};

export type CandlestickChartXValue = Date | number | string;

export type CandlestickChartXValueType = "date" | "number" | "string";

export type CandlestickChartGrouping =
	| "auto"
	| "year"
	| "quarter"
	| "month"
	| "week"
	| "day"
	| "value";

export type CandlestickChartTransform = {
	groupBy?: CandlestickChartGrouping;
	sort?: boolean;
	tickCount?: number;
	xValueType?: CandlestickChartXValueType | "auto";
};

export type CandlestickChartCandle<
	TRow extends CandlestickChartRow = CandlestickChartRow,
> = {
	row: TRow;
	x: CandlestickChartXValue;
	xType: CandlestickChartXValueType;
	label: string;
	open: number;
	high: number;
	low: number;
	close: number;
	isUp: boolean;
	isDown: boolean;
	isFlat: boolean;
	change: number;
	changeRate: number | null;
	sortValue: number | string;
};

export type CandlestickChartTick = {
	index: number;
	label: string;
	value: CandlestickChartXValue;
};

export type CandlestickChartGeometry = {
	boxAlignment: Alignment;
	boxHeightFactor: number;
	topWickRatio: number;
	bodyRatio: number;
	bottomWickRatio: number;
};

export type CandlestickChartScale = {
	min: number;
	max: number;
	step: number;
};

export type CandlestickChartScaleOptions = {
	roughStepCount?: number;
};

export type CandlestickChartCustom<TConfig extends object = object> = {
	candlestickBox: CustomArgs<
		{
			candlestick: Widget;
			candle: CandlestickChartCandle;
			geometry: CandlestickChartGeometry;
			index: number;
			isHovered: boolean;
		},
		TConfig
	>;
	candlestick: CustomArgs<
		{
			candle: CandlestickChartCandle;
			geometry: CandlestickChartGeometry;
			index: number;
			isHovered: boolean;
		},
		TConfig
	>;
	tooltip: CustomArgs<
		{
			label: string;
			items: { legend: string; color: string; value: number | string }[];
		},
		TConfig
	>;
	xAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	yAxis: CustomArgs<{ line: Widget; labels: Widget[]; tick: Widget }, TConfig>;
	xAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	yAxisLabel: CustomArgs<{ name: string; index: number }, TConfig>;
	xAxisTick: CustomArgs<undefined, TConfig>;
	yAxisTick: CustomArgs<undefined, TConfig>;
	dataView: CustomArgs<{ candlesticks: Widget[] }, TConfig>;
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<
		{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget; tooltipArea: Widget },
		TConfig
	>;
	tooltipArea: CustomArgs<
		{
			tooltip: Widget | null;
			hoveredCandlestick: {
				index: number;
				candle: CandlestickChartCandle;
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
	dataLabel: CustomArgs<{ value: number; label: string; legend: string }, TConfig>;
	xAxisLine: CustomArgs<undefined, TConfig>;
	yAxisLine: CustomArgs<undefined, TConfig>;
	axisCorner: CustomArgs<undefined, TConfig>;
	grid: CustomArgs<{ xLine: Widget; yLine: Widget }, TConfig>;
	gridXLine: CustomArgs<undefined, TConfig>;
	gridYLine: CustomArgs<undefined, TConfig>;
};

export type GetScaleFn = (
	candles: CandlestickChartCandle[],
	options?: CandlestickChartScaleOptions,
) => CandlestickChartScale;

export type GetScaleOptionsFn = (
	context: CandlestickChartController,
) => CandlestickChartScaleOptions;

export type GetTicksFn = (
	candles: CandlestickChartCandle[],
	xValueType: CandlestickChartXValueType,
	transform: CandlestickChartTransform,
	width: number,
) => CandlestickChartTick[];
