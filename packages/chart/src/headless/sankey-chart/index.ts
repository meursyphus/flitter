import type { Widget } from "flitter-core";
import type { SankeyChartCustom, SankeyChartData } from "./types";
import { SankeyChartProvider } from "./provider";

export default function SankeyChart<TConfig extends object = object>(props: {
	custom: SankeyChartCustom<TConfig>;
	data: SankeyChartData;
	config?: TConfig;
}): Widget {
	return SankeyChartProvider(props);
}
