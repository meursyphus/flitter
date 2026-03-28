import type { Widget } from "flitter-core";
import type { SankeyChartController } from "./controller";

type CustomArgs<T = undefined, TConfig = {}> = (
	args: T,
	context: SankeyChartContext<TConfig>,
) => Widget;

export type SankeyChartContext<TConfig = {}> = SankeyChartController & {
	config: TConfig;
};

export type SankeyChartData = { from: string; to: string; value: number }[];

export type SankeyNodeLayout = {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  column: number;
  totalValue: number;
};

export type SankeyLinkLayout = {
  source: string;
  target: string;
  value: number;
  sourceX: number;
  sourceY: number;
  sourceHeight: number;
  targetX: number;
  targetY: number;
  targetHeight: number;
  color: string;
};

export type SankeyLayout = {
  nodes: SankeyNodeLayout[];
  links: SankeyLinkLayout[];
  totalColumns: number;
};

export type SankeyChartCustom<TConfig = {}> = {
	layout: CustomArgs<{ title: Widget; dataView: Widget }, TConfig>;
	dataView: CustomArgs<{ nodes: Widget[]; links: Widget[]; nodeLabels: Widget[] }, TConfig>;
	node: CustomArgs<
		{
			id: string;
			label: string;
			color: string;
			x: number;
			y: number;
			width: number;
			height: number;
		},
		TConfig
	>;
	link: CustomArgs<
		{
			source: string;
			target: string;
			value: number;
			sourceX: number;
			sourceY: number;
			sourceHeight: number;
			targetX: number;
			targetY: number;
			targetHeight: number;
			color: string;
		},
		TConfig
	>;
	nodeLabel: CustomArgs<
		{
			id: string;
			label: string;
			x: number;
			y: number;
			width: number;
			height: number;
			column: number;
			totalColumns: number;
		},
		TConfig
	>;
	title: CustomArgs<undefined, TConfig>;
};
