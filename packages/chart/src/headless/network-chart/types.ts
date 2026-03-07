import type { Widget } from "flitter-core";
import type { NetworkChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: NetworkChartContext<TConfig>,
) => Widget;

export type NetworkChartContext<TConfig = {}> = NetworkChartController & {
	config: TConfig;
};

export type NetworkNode = {
	id: string;
	label?: string;
	group?: string;
	size?: number;
};

export type NetworkEdge = {
	source: string;
	target: string;
	weight?: number;
};

export type NetworkChartData = {
	nodes: NetworkNode[];
	edges: NetworkEdge[];
};

export type NetworkNodeLayout = NetworkNode & {
	x: number;
	y: number;
	index: number;
};

export type NetworkEdgeLayout = NetworkEdge & {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	index: number;
};

export type NetworkLayout = {
	nodes: NetworkNodeLayout[];
	edges: NetworkEdgeLayout[];
};

export type NetworkChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; legends: Widget[]; network: Widget }, TConfig>;
	network: CustomArgs<{ nodes: Widget[]; edges: Widget[]; nodeLabels: Widget[] }, TConfig>;
	node: CustomArgs<
		{ id: string; label: string; x: number; y: number; size: number; group?: string; index: number },
		TConfig
	>;
	edge: CustomArgs<
		{ source: string; target: string; x1: number; y1: number; x2: number; y2: number; weight?: number; index: number },
		TConfig
	>;
	nodeLabel: CustomArgs<{ label: string; x: number; y: number; index: number }, TConfig>;
	title: CustomArgs<undefined, TConfig>;
	legend: CustomArgs<{ name: string; index: number }, TConfig>;
};
