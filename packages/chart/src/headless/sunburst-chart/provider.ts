import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { SunburstChartCustom, SunburstChartData } from "./types";
import { SunburstChartController } from "./controller";
import Chart from "./chart";

const SUNBURST_CHART_KEY = Symbol("SunburstChartKey");

export function SunburstChartProvider({
	custom,
	data,
	config = {},
}: {
	custom: SunburstChartCustom<any>;
	data: SunburstChartData;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: SUNBURST_CHART_KEY,
		create: () =>
			new SunburstChartController({
				data,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as SunburstChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

SunburstChartProvider.of = (context: BuildContext): SunburstChartController => {
	return Provider.of(SUNBURST_CHART_KEY, context) as SunburstChartController;
};
