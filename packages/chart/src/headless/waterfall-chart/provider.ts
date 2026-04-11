import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type {
	GetScaleFn,
	GetScaleOptionsFn,
	WaterfallChartCustom,
	WaterfallChartData,
} from "./types";
import { getScale } from "./transform";
import { WaterfallChartController } from "./controller";
import Chart from "./chart";

const WATERFALL_CHART_KEY = Symbol("WaterfallChartKey");

export function WaterfallChartProvider<TConfig extends object = object>({
	custom,
	data,
	getScale: scaleFn = getScale,
	getScaleOptions,
	config,
}: {
	custom: WaterfallChartCustom<TConfig>;
	data: WaterfallChartData;
	getScale?: GetScaleFn;
	getScaleOptions?: GetScaleOptionsFn;
	config?: TConfig;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: WATERFALL_CHART_KEY,
		create: () =>
			new WaterfallChartController({
				data,
				getScale: scaleFn,
				getScaleOptions,
				custom,
				config: config ?? {},
			}),
		update: (notifier) => {
			const controller = notifier as WaterfallChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config ?? {};
		},
		child: new Chart(),
	});
}

WaterfallChartProvider.of = (
	context: BuildContext,
): WaterfallChartController => {
	return Provider.of(WATERFALL_CHART_KEY, context) as WaterfallChartController;
};
