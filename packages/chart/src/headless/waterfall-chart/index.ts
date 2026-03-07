import type { Widget } from "flitter-core";
import type { WaterfallChartCustom, WaterfallChartData } from "./types";
import { WaterfallChartProvider } from "./provider";

export default function WaterfallChart<TConfig = {}>(props: {
	custom: WaterfallChartCustom<TConfig>;
	data: WaterfallChartData;
	config?: TConfig;
}): Widget {
	return WaterfallChartProvider(props as any);
}
