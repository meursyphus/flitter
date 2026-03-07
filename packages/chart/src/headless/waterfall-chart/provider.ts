import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { WaterfallChartCustom, WaterfallChartData } from "./types";
import { WaterfallChartController } from "./controller";
import Chart from "./chart";

const WATERFALL_CHART_KEY = Symbol("WaterfallChartKey");

export function WaterfallChartProvider({
	custom,
	data,
	config = {},
}: {
	custom: WaterfallChartCustom<any>;
	data: WaterfallChartData;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: WATERFALL_CHART_KEY,
		create: () =>
			new WaterfallChartController({
				data,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as WaterfallChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

WaterfallChartProvider.of = (
	context: BuildContext,
): WaterfallChartController => {
	return Provider.of(WATERFALL_CHART_KEY, context) as WaterfallChartController;
};
