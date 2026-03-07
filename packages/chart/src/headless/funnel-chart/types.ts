import type { Widget } from "flitter-core";
import type { FunnelChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: FunnelChartContext<TConfig>,
) => Widget;

export type FunnelChartContext<TConfig = {}> = FunnelChartController & {
	config: TConfig;
};

export type FunnelChartStage = {
	label: string;
	value: number;
	color?: string;
};

export type FunnelChartStageView = FunnelChartStage & {
	index: number;
	color: string;
	ratio: number;
	percentage: number;
};

export type FunnelChartData = {
	stages: FunnelChartStage[];
};

export type FunnelChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; legends: Widget[]; funnel: Widget }, TConfig>;
	funnel: CustomArgs<{ stages: Widget[] }, TConfig>;
	stage: CustomArgs<
		{
			index: number;
			label: string;
			value: number;
			ratio: number;
			color: string;
			stageLabel: Widget;
			dataLabel: Widget;
		},
		TConfig
	>;
	stageLabel: CustomArgs<{ label: string; index: number }, TConfig>;
	dataLabel: CustomArgs<
		{
			value: number;
			percentage: number;
			label: string;
			index: number;
		},
		TConfig
	>;
	legend: CustomArgs<{ label: string; color: string; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
};
