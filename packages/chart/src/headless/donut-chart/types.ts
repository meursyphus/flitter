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

export type DonutChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; legends: Widget[]; dataView: Widget }, TConfig>;
	dataView: CustomArgs<
		{
			slices: {
				widget: Widget;
				startAngle: number;
				sweepAngle: number;
				percentage: number;
				index: number;
				name: string;
				value: number;
			}[];
			centerContent: Widget;
		},
		TConfig
	>;
	slice: CustomArgs<
		{ index: number; name: string; value: number; percentage: number; sweepAngle: number },
		TConfig
	>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	centerContent: CustomArgs<{ total: number }, TConfig>;
};
