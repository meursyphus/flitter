import type { Widget } from "flitter-core";
import type {
	HistogramChartCustom,
	HistogramChartData,
	HistogramChartTransform,
} from "./types";
import { HistogramChartProvider } from "./provider";

export default function HistogramChart<TConfig = {}>(props: {
	custom: HistogramChartCustom<TConfig>;
	data: HistogramChartData;
	transform?: HistogramChartTransform;
	config?: TConfig;
}): Widget {
	return HistogramChartProvider(props as any);
}
