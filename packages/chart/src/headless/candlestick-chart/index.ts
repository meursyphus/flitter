import type { Widget } from "flitter-core";
import type {
	CandlestickChartCustom,
	CandlestickChartData,
	CandlestickChartTransform,
	GetScaleFn,
	GetScaleOptionsFn,
	GetTicksFn,
} from "./types";
import { CandlestickChartProvider } from "./provider";

export default function CandlestickChart<TConfig extends object = object>(props: {
	custom: CandlestickChartCustom<TConfig>;
	data: CandlestickChartData;
	transform?: CandlestickChartTransform;
	getScale: GetScaleFn;
	getScaleOptions?: GetScaleOptionsFn;
	getTicks?: GetTicksFn;
	config?: TConfig;
}): Widget {
	return CandlestickChartProvider(props);
}
