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
	value: number;
	color?: string;
};

export type TreemapData = {
	nodes: TreemapNode[];
};

export type TreemapLayout = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type TreemapCustom<TConfig = {}> = {
	layout: CustomArgs<
		{ title: Widget; legends: Widget[]; treemap: Widget },
		TConfig
	>;
	title: CustomArgs<undefined, TConfig>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
	treemap: CustomArgs<{ nodes: Widget[] }, TConfig>;
	node: CustomArgs<
		{
			label: string;
			value: number;
			color: string;
			index: number;
			ratio: number;
			x: number;
			y: number;
			width: number;
			height: number;
		},
		TConfig
	>;
};
