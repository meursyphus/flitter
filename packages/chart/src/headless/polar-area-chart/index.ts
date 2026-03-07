import type { Widget } from "flitter-core";
import type { PolarAreaChartCustom, PolarAreaChartData } from "./types";
import { PolarAreaChartProvider } from "./provider";

export default function PolarAreaChart<TConfig = {}>(props: {
	custom: PolarAreaChartCustom<TConfig>;
	data: PolarAreaChartData;
	config?: TConfig;
}): Widget {
	return PolarAreaChartProvider(props as any);
}
