import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { TreemapCustom, TreemapData } from "./types";
import { TreemapController } from "./controller";
import Chart from "./chart";

const TREEMAP_CHART_KEY = Symbol("TreemapChartKey");

export function TreemapChartProvider({
	custom,
	data,
	config = {},
}: {
	custom: TreemapCustom<any>;
	data: TreemapData;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: TREEMAP_CHART_KEY,
		create: () =>
			new TreemapController({
				data,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as TreemapController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

TreemapChartProvider.of = (context: BuildContext): TreemapController => {
	return Provider.of(TREEMAP_CHART_KEY, context) as TreemapController;
};
