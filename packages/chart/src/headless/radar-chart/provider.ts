import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type {
	RadarChartCustom,
	RadarChartData,
	GetScaleFn,
} from "./types";
import { RadarChartController } from "./controller";
import Chart from "./chart";

const RADAR_CHART_KEY = Symbol("RadarChartKey");

export function RadarChartProvider({
	custom,
	getScale,
	data,
	config = {},
}: {
	custom: RadarChartCustom<any>;
	data: RadarChartData;
	getScale: GetScaleFn;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: RADAR_CHART_KEY,
		create: () =>
			new RadarChartController({
				data,
				getScale,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as RadarChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

RadarChartProvider.of = (context: BuildContext): RadarChartController => {
	return Provider.of(RADAR_CHART_KEY, context) as RadarChartController;
};
