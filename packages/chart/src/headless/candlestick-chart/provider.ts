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
} from "./types";
import { CandlestickChartController } from "./controller";
import Chart from "./chart";

const CANDLESTICK_CHART_KEY = Symbol("CandlestickChartKey");

export function CandlestickChartProvider({
	custom,
	getScale,
	getScaleOptions,
	data,
	transform = {},
	config = {},
}: {
	custom: CandlestickChartCustom<any>;
	data: CandlestickChartData;
	transform?: CandlestickChartTransform;
	getScale: GetScaleFn;
	getScaleOptions?: GetScaleOptionsFn;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: CANDLESTICK_CHART_KEY,
		create: () =>
			new CandlestickChartController({
				data,
				transform,
				getScale,
				getScaleOptions,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as CandlestickChartController;
			controller.data = data;
			controller.transform = transform;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

CandlestickChartProvider.of = (
	context: BuildContext,
): CandlestickChartController => {
	return Provider.of(CANDLESTICK_CHART_KEY, context) as CandlestickChartController;
};
