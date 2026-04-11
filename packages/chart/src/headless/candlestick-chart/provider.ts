import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type {
	CandlestickChartCustom,
	CandlestickChartData,
	CandlestickChartTransform,
	GetScaleFn,
	GetScaleOptionsFn,
	GetTicksFn,
} from "./types";
import { CandlestickChartController } from "./controller";
import Chart from "./chart";
import { createTicks } from "./transform";

const CANDLESTICK_CHART_KEY = Symbol("CandlestickChartKey");

export function CandlestickChartProvider<TConfig extends object = object>({
	custom,
	getScale,
	getScaleOptions,
	getTicks = createTicks,
	data,
	transform = {},
	config,
}: {
	custom: CandlestickChartCustom<TConfig>;
	data: CandlestickChartData;
	transform?: CandlestickChartTransform;
	getScale: GetScaleFn;
	getScaleOptions?: GetScaleOptionsFn;
	getTicks?: GetTicksFn;
	config?: TConfig;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: CANDLESTICK_CHART_KEY,
		create: () =>
			new CandlestickChartController({
				data,
				transform,
				getScale,
				getScaleOptions,
				getTicks,
				custom,
				config: config ?? {},
			}),
		update: (notifier) => {
			const controller = notifier as CandlestickChartController;
			controller.data = data;
			controller.transform = transform;
			controller.custom = custom;
			controller.config = config ?? {};
		},
		child: new Chart(),
	});
}

CandlestickChartProvider.of = (
	context: BuildContext,
): CandlestickChartController => {
	return Provider.of(CANDLESTICK_CHART_KEY, context) as CandlestickChartController;
};
