import type { Widget } from "flitter-core";
import type { ComboChartCustom, ComboChartData } from "./types";
import { ComboChartProvider } from "./provider";

export default function ComboChart<TConfig = {}>(props: {
	custom: ComboChartCustom<TConfig>;
	data: ComboChartData;
	config?: TConfig;
}): Widget {
	return ComboChartProvider(props as any);
}
