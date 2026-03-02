import type { Widget } from "flitter-core";
import type { PieChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: PieChartContext<TConfig>) => Widget;

export type PieChartContext<TConfig = {}> = PieChartController & { config: TConfig };

export type PieChartData = {
	datasets: { name: string; value: number }[];
};

export type PieChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; legends: Widget[]; series: Widget }, TConfig>;
	series: CustomArgs<
		{
			pies: {
				widget: Widget;
				startAngle: number;
				sweepAngle: number;
				percentage: number;
				index: number;
				name: string;
				value: number;
			}[];
		},
		TConfig
	>;
	pie: CustomArgs<
		{ index: number; name: string; value: number; percentage: number; sweepAngle: number },
		TConfig
	>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
};
