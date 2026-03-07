import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { HistogramChartCustom, HistogramChartData } from "./types";
import { HistogramChartController } from "./controller";
import Chart from "./chart";

const HISTOGRAM_CHART_KEY = Symbol("HistogramChartKey");

export function HistogramChartProvider({
	custom,
	data,
	config = {},
}: {
	custom: HistogramChartCustom<any>;
	data: HistogramChartData;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: HISTOGRAM_CHART_KEY,
		create: () =>
			new HistogramChartController({
				data,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as HistogramChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

HistogramChartProvider.of = (
	context: BuildContext,
): HistogramChartController => {
	return Provider.of(HISTOGRAM_CHART_KEY, context) as HistogramChartController;
};
