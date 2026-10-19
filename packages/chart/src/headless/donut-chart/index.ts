import type { Widget } from "flitterjs";
import type { DonutChartCustom, DonutChartData } from "./types";
import { DonutChartProvider } from "./provider";

export default function DonutChart<TConfig extends object = object>(props: {
	custom: DonutChartCustom<TConfig>;
	data: DonutChartData;
	config?: TConfig;
}): Widget {
	return DonutChartProvider(props);
}
