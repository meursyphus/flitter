import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { GaugeChartCustom, GaugeChartData } from "./types";
import { GaugeChartController } from "./controller";
import Chart from "./chart";

const GAUGE_CHART_KEY = Symbol("GaugeChartKey");

export function GaugeChartProvider({
	custom,
	data,
	config = {},
}: {
	custom: GaugeChartCustom<any>;
	data: GaugeChartData;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: GAUGE_CHART_KEY,
		create: () =>
			new GaugeChartController({
				data,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as GaugeChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

GaugeChartProvider.of = (context: BuildContext): GaugeChartController => {
	return Provider.of(GAUGE_CHART_KEY, context) as GaugeChartController;
};
