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

export function RadarChartProvider<TConfig extends object = {}>({
	custom,
	getScale,
	data,
	config = {} as TConfig,
}: {
	custom: RadarChartCustom<TConfig>;
	data: RadarChartData;
	getScale: GetScaleFn;
	config?: TConfig;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: RADAR_CHART_KEY,
		create: () =>
			new RadarChartController<TConfig>({
				data,
				getScale,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as RadarChartController<TConfig>;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

RadarChartProvider.of = <TConfig extends object = {}>(context: BuildContext): RadarChartController<TConfig> => {
	return Provider.of(RADAR_CHART_KEY, context) as RadarChartController<TConfig>;
};
