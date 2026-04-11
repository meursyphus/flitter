import type { Widget } from "flitter-core";
import type { PieChartCustom, PieChartData } from "./types";
import { PieChartProvider } from "./provider";

export default function PieChart<TConfig extends object = object>(props: {
	custom: PieChartCustom<TConfig>;
	data: PieChartData;
	config?: TConfig;
}): Widget {
	return PieChartProvider(props);
}
