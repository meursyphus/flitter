import type { Widget } from "flitterjs";
import type { HeatmapCustom, HeatmapData } from "./types";
import { HeatmapChartProvider } from "./provider";

export default function HeatmapChart<TConfig extends object = object>(props: {
	custom: HeatmapCustom<TConfig>;
	data: HeatmapData;
	config?: TConfig;
}): Widget {
	return HeatmapChartProvider(props);
}
