import type { Widget } from "flitter-core";
import type { GaugeChartCustom, GaugeChartData } from "./types";
import { GaugeChartProvider } from "./provider";

export default function GaugeChart<TConfig = {}>(props: {
	custom: GaugeChartCustom<TConfig>;
	data: GaugeChartData;
	config?: TConfig;
}): Widget {
	return GaugeChartProvider(props as any);
}
