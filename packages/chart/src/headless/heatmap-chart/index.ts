import type { Widget } from "flitter-core";
import type { HeatmapCustom, HeatmapData } from "./types";
import { HeatmapChartProvider } from "./provider";

export default function HeatmapChart<TConfig = {}>(props: {
	custom: HeatmapCustom<TConfig>;
	data: HeatmapData;
	config?: TConfig;
}): Widget {
	return HeatmapChartProvider(props as any);
}
