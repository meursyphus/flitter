import type { Widget } from "flitter-core";
import type { SankeyChartCustom, SankeyChartData } from "./types";
import { SankeyChartProvider } from "./provider";

export default function SankeyChart<TConfig = {}>(props: {
	custom: SankeyChartCustom<TConfig>;
	data: SankeyChartData;
	config?: TConfig;
}): Widget {
	return SankeyChartProvider(props as any);
}
