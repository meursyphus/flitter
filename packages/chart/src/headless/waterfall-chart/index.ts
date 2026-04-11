import type { Widget } from "flitter-core";
import type {
	GetScaleFn,
	GetScaleOptionsFn,
	WaterfallChartCustom,
	WaterfallChartData,
} from "./types";
import { WaterfallChartProvider } from "./provider";

export default function WaterfallChart<TConfig extends object = object>(props: {
	custom: WaterfallChartCustom<TConfig>;
	data: WaterfallChartData;
	getScale?: GetScaleFn;
	getScaleOptions?: GetScaleOptionsFn;
	config?: TConfig;
}): Widget {
	return WaterfallChartProvider(props);
}
