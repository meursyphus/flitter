import type { Widget } from "flitter-core";
import type {
	CandlestickChartCustom,
	CandlestickChartData,
	GetScaleFn,
	GetScaleOptionsFn,
} from "./types";
import { CandlestickChartProvider } from "./provider";

export default function CandlestickChart<TConfig = {}>(props: {
	custom: CandlestickChartCustom<TConfig>;
	data: CandlestickChartData;
	getScale: GetScaleFn;
	getScaleOptions?: GetScaleOptionsFn;
	config?: TConfig;
}): Widget {
	return CandlestickChartProvider(props as any);
}
