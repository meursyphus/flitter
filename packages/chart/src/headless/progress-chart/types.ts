import type { Widget } from "flitter-core";
import type { ProgressChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: ProgressChartContext<TConfig>,
) => Widget;

export type ProgressChartContext<TConfig = {}> = ProgressChartController & {
	config: TConfig;
};

export type ProgressChartData =
	| {
			value: number;
			max?: number;
			label?: string;
	  }
	| {
			segments: {
				value: number;
				label: string;
				color?: string;
			}[];
			max?: number;
	  };

export type ProgressSegment = {
	value: number;
	ratio: number;
	index: number;
	label: string;
	color?: string;
};

export type ProgressChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; track: Widget; valueLabel: Widget }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	track: CustomArgs<{ fills: Widget[] }, TConfig>;
	fill: CustomArgs<
		{
			value: number;
			ratio: number;
			index: number;
			label: string;
			color?: string;
			segmentLabel: Widget;
		},
		TConfig
	>;
	valueLabel: CustomArgs<{ value: number; max: number; ratio: number }, TConfig>;
	segmentLabel: CustomArgs<{ value: number; ratio: number; index: number; label: string }, TConfig>;
};
