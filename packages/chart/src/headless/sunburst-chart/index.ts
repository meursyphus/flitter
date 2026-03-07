import type { Widget } from "flitter-core";
import type { SunburstChartCustom, SunburstChartData } from "./types";
import { SunburstChartProvider } from "./provider";

export default function SunburstChart<TConfig = {}>(props: {
	custom: SunburstChartCustom<TConfig>;
	data: SunburstChartData;
	config?: TConfig;
}): Widget {
	return SunburstChartProvider(props as any);
}
