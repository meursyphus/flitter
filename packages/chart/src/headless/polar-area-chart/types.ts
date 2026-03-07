import type { Widget } from "flitter-core";
import type { PolarAreaChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: PolarAreaChartContext<TConfig>,
) => Widget;

export type PolarAreaChartContext<TConfig = {}> = PolarAreaChartController & {
	config: TConfig;
};

export type PolarAreaChartData = {
	datasets: { name: string; value: number }[];
};

export type PolarAreaChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; legends: Widget[]; dataView: Widget }, TConfig>;
	dataView: CustomArgs<{ sectors: Widget[]; scale: Widget }, TConfig>;
	sector: CustomArgs<
		{
			index: number;
			name: string;
			value: number;
			ratio: number;
			angle: number;
			startAngle: number;
		},
		TConfig
	>;
	scale: CustomArgs<{ maxValue: number; count: number }, TConfig>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
};
