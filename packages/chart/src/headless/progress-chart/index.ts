import type { Widget } from "flitter-core";
import type { ProgressChartCustom, ProgressChartData } from "./types";
import { ProgressChartProvider } from "./provider";

export default function ProgressChart<TConfig = {}>(props: {
	custom: ProgressChartCustom<TConfig>;
	data: ProgressChartData;
	config?: TConfig;
}): Widget {
	return ProgressChartProvider(props as any);
}
