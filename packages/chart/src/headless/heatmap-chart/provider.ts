import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { HeatmapCustom, HeatmapData } from "./types";
import { HeatmapController } from "./controller";
import Chart from "./chart";

const HEATMAP_CHART_KEY = Symbol("HeatmapChartKey");

export function HeatmapChartProvider({
	custom,
	data,
	config = {},
}: {
	custom: HeatmapCustom<any>;
	data: HeatmapData;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: HEATMAP_CHART_KEY,
		create: () =>
			new HeatmapController({
				data,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as HeatmapController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

HeatmapChartProvider.of = (context: BuildContext): HeatmapController => {
	return Provider.of(HEATMAP_CHART_KEY, context) as HeatmapController;
};
