import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type {
	HistogramChartCustom,
	HistogramChartData,
	HistogramChartTransform,
} from "./types";
import { HistogramChartController } from "./controller";
import Chart from "./chart";

const HISTOGRAM_CHART_KEY = Symbol("HistogramChartKey");

export function HistogramChartProvider<TConfig extends object = object>({
	custom,
	data,
	transform = {},
	config,
}: {
	custom: HistogramChartCustom<TConfig>;
	data: HistogramChartData;
	transform?: HistogramChartTransform;
	config?: TConfig;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: HISTOGRAM_CHART_KEY,
		create: () =>
			new HistogramChartController({
				data,
				transform,
				custom,
				config: config ?? {},
			}),
		update: (notifier) => {
			const controller = notifier as HistogramChartController;
			controller.data = data;
			controller.transform = transform;
			controller.custom = custom;
			controller.config = config ?? {};
		},
		child: new Chart(),
	});
}

HistogramChartProvider.of = (
	context: BuildContext,
): HistogramChartController => {
	return Provider.of(HISTOGRAM_CHART_KEY, context) as HistogramChartController;
};
