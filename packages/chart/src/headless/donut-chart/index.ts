import type { Widget } from "flitter-core";
import type { DonutChartCustom, DonutChartData } from "./types";
import { DonutChartProvider } from "./provider";

export default function DonutChart<TConfig = {}>(props: {
	custom: DonutChartCustom<TConfig>;
	data: DonutChartData;
	config?: TConfig;
}): Widget {
	return DonutChartProvider(props as any);
}
