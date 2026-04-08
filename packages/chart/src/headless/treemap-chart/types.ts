import type { Widget } from "flitter-core";
import type { TreemapController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: TreemapContext<TConfig>,
) => Widget;

export type TreemapContext<TConfig = {}> = TreemapController & {
	config: TConfig;
};

export type TreemapNode = {
	label: string;
	value?: number;
	secondaryLabel?: string;
	children?: TreemapNode[];
};

export type TreemapDataset = {
	legend: string;
	visible?: boolean;
	value?: number;
	secondaryLabel?: string;
	children?: TreemapNode[];
};

export type TreemapData = {
	datasets: TreemapDataset[];
};

export type TreemapLegacyData = {
	nodes: TreemapNode[];
};

export type TreemapResolvedNode = {
	key: string;
	path: number[];
	label: string;
	value: number;
	secondaryLabel?: string;
	children: TreemapResolvedNode[];
};

export type TreemapResolvedDataset = {
	legend: string;
	value: number;
	children: TreemapResolvedNode[];
};

export type TreemapResolvedData = {
	datasets: TreemapResolvedDataset[];
};

export type TreemapRect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type TreemapLayoutSize = {
	width: number;
	height: number;
};

export type TreemapLayoutItem = {
	value: number;
	index: number;
};

export type TreemapLayoutDirection = "row" | "column";

export type TreemapLayout = {
	kind: "leaf";
	index: number;
} | {
	kind: "branch";
	direction: TreemapLayoutDirection;
	children: {
		flex: number;
		node: TreemapLayout;
	}[];
};

export type TreemapLayoutOptions = {
	mode?: "squarify" | "slice-vertical" | "slice-horizontal";
	preserveOrder?: boolean;
};

export type GetTreemapLayoutFn = (
	items: TreemapLayoutItem[],
	size: TreemapLayoutSize,
	options?: TreemapLayoutOptions,
) => TreemapLayout | null;

export type GetTreemapLayoutOptionsFn = (
	context: TreemapController,
) => TreemapLayoutOptions;

export type TreemapHoveredNode = {
	key: string;
	label: string;
	secondaryLabel?: string;
	value: number;
	legend: string;
	groupIndex: number;
	color: string;
};

export type TreemapHoveredNodeRect = TreemapHoveredNode & TreemapRect;

export type TreemapCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
	plot: CustomArgs<{ treemap: Widget; tooltipArea: Widget }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	legend: CustomArgs<{ name: string; index: number; isVisible: boolean }, TConfig>;
	treemap: CustomArgs<{ tree: Widget }, TConfig>;
	group: CustomArgs<
		{
			title: Widget;
			nodes: Widget;
			legend: string;
			index: number;
			color: string;
			ratio: number;
			isHovered: boolean;
		},
		TConfig
	>;
	groupTitle: CustomArgs<{ legend: string; index: number }, TConfig>;
	nodes: CustomArgs<{ tree: Widget; legend: string; index: number }, TConfig>;
	node: CustomArgs<
		{
			label: string;
			secondaryLabel?: string;
			value: number;
			legend: string;
			groupIndex: number;
			index: number;
			color: string;
			ratio: number;
			groupRatio: number;
			isHovered: boolean;
			dataLabel: Widget;
		},
		TConfig
	>;
	dataLabel: CustomArgs<
		{
			label: string;
			secondaryLabel?: string;
			value: number;
			legend: string;
			groupIndex: number;
			index: number;
			ratio: number;
			groupRatio: number;
			isHovered: boolean;
		},
		TConfig
	>;
	tooltip: CustomArgs<
		{
			label: string;
			items: { legend: string; color: string; value: number }[];
		},
		TConfig
	>;
	tooltipArea: CustomArgs<
		{
			tooltip: Widget | null;
			hoveredNode: TreemapHoveredNodeRect | null;
		},
		TConfig
	>;
};
