import type { Widget } from "flitter-core";
import type { GaugeChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: GaugeChartContext<TConfig>,
) => Widget;

export type GaugeChartContext<TConfig = {}> = GaugeChartController & {
	config: TConfig;
};

export type GaugeChartZone = {
	min: number;
	max: number;
	color: string;
};

export type GaugeChartData = {
	value: number;
	min: number;
	max: number;
	zones?: GaugeChartZone[];
};

export type GaugeChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; gauge: Widget; valueLabel: Widget }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	gauge: CustomArgs<{ needle: Widget; scale: Widget }, TConfig>;
	needle: CustomArgs<{ value: number; ratio: number; angle: number }, TConfig>;
	valueLabel: CustomArgs<{ value: number; min: number; max: number; ratio: number }, TConfig>;
	scale: CustomArgs<{ min: number; max: number; zones: GaugeChartZone[] }, TConfig>;
};
