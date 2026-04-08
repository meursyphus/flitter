import type { Widget } from "flitter-core";
import type { RadarChartCustom, RadarChartData, GetScaleFn } from "./types";
import { RadarChartProvider } from "./provider";

export default function RadarChart<TConfig extends object = {}>(props: {
	custom: RadarChartCustom<TConfig>;
	data: RadarChartData;
	getScale: GetScaleFn;
	config?: TConfig;
}): Widget {
	return RadarChartProvider<TConfig>(props);
}
