import type { Widget } from "flitter-core";
import type { FunnelChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: FunnelChartContext<TConfig>,
) => Widget;

export type FunnelChartContext<TConfig = {}> = FunnelChartController & {
	config: TConfig;
};

export type FunnelChartDirection = "vertical" | "horizontal";

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
	stepPercentage: number | null;
	previousValue: number | null;
	nextValue: number | null;
	previousRatio: number | null;
	nextRatio: number | null;
};

export type FunnelChartData = {
	stages: FunnelChartStage[];
};

export type FunnelChartHoveredStage = FunnelChartStageView;

export type FunnelChartHoveredStageRect = FunnelChartHoveredStage & {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type FunnelChartCustom<TConfig = {}> = {
	layout: CustomArgs<
		{ title: Widget; legends: Widget[]; funnel: Widget; plot: Widget },
		TConfig
	>;
	plot: CustomArgs<{ labels: Widget[]; dataView: Widget; tooltipArea: Widget }, TConfig>;
	funnel: CustomArgs<{ stages: Widget[] }, TConfig>;
	dataView: CustomArgs<{ stages: Widget[] }, TConfig>;
	stage: CustomArgs<
		{
			index: number;
			label: string;
			value: number;
			ratio: number;
			percentage: number;
			stepPercentage: number | null;
			color: string;
			previousValue: number | null;
			nextValue: number | null;
			previousRatio: number | null;
			nextRatio: number | null;
			isHovered: boolean;
			isDimmed: boolean;
			segment: Widget;
			connector: Widget | null;
			dataLabel: Widget;
		},
		TConfig
	>;
	segment: CustomArgs<
		{
			index: number;
			label: string;
			value: number;
			ratio: number;
			percentage: number;
			stepPercentage: number | null;
			color: string;
			isHovered: boolean;
			isDimmed: boolean;
			dataLabel: Widget;
		},
		TConfig
	>;
	connector: CustomArgs<
		{
			index: number;
			label: string;
			value: number;
			ratio: number;
			percentage: number;
			stepPercentage: number | null;
			color: string;
			previousRatio: number | null;
			nextRatio: number | null;
			isHovered: boolean;
			isDimmed: boolean;
		},
		TConfig
	>;
	stageLabel: CustomArgs<
		{
			label: string;
			index: number;
			value: number;
			percentage: number;
			stepPercentage: number | null;
		},
		TConfig
	>;
	dataLabel: CustomArgs<
		{
			value: number;
			percentage: number;
			stepPercentage: number | null;
			label: string;
			index: number;
		},
		TConfig
	>;
	legend: CustomArgs<{ label: string; color: string; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	tooltip: CustomArgs<
		{
			label: string;
			items: { legend: string; color: string; value: number | string }[];
		},
		TConfig
	>;
	tooltipArea: CustomArgs<
		{
			tooltip: Widget | null;
			hoveredStage: FunnelChartHoveredStageRect | null;
		},
		TConfig
	>;
};
