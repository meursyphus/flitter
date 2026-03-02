import type { Widget } from "flitter-core";
import type { PieChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (args: T, context: PieChartContext<TConfig>) => Widget;

export type PieChartContext<TConfig = {}> = PieChartController & { config: TConfig };

export type PieChartData = {
	labels: string[];
	values: number[];
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
				label: string;
				value: number;
			}[];
			dataLabels: Widget[];
		},
		TConfig
	>;
	pie: CustomArgs<
		{ index: number; label: string; value: number; percentage: number; startAngle: number; sweepAngle: number },
		TConfig
	>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	dataLabel: CustomArgs<
		{ label: string; value: number; percentage: number; index: number; startAngle: number; sweepAngle: number },
		TConfig
	>;
};
