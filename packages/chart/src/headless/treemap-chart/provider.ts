import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type {
	GetTreemapLayoutFn,
	GetTreemapLayoutOptionsFn,
	TreemapCustom,
	TreemapData,
	TreemapLegacyData,
} from "./types";
import { TreemapController } from "./controller";
import { defaultGetTreemapLayout } from "./layout";
import Chart from "./chart";

const TREEMAP_CHART_KEY = Symbol("TreemapChartKey");

export function TreemapChartProvider<TConfig extends object = object>({
	custom,
	data,
	config,
	getLayout,
	getLayoutOptions,
}: {
	custom: TreemapCustom<TConfig>;
	data: TreemapData | TreemapLegacyData;
	config?: TConfig;
	getLayout?: GetTreemapLayoutFn;
	getLayoutOptions?: GetTreemapLayoutOptionsFn | null;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: TREEMAP_CHART_KEY,
		create: () =>
			new TreemapController({
				data,
				custom,
				config: config ?? {},
				getLayout,
				getLayoutOptions,
			}),
		update: (notifier) => {
			const controller = notifier as TreemapController;
			controller.getLayout = getLayout ?? defaultGetTreemapLayout;
			controller.getLayoutOptions = getLayoutOptions ?? null;
			controller.custom = custom;
			controller.config = config ?? {};
			controller.data = data;
		},
		child: new Chart(),
	});
}

TreemapChartProvider.of = (context: BuildContext): TreemapController => {
	return Provider.of(TREEMAP_CHART_KEY, context) as TreemapController;
};
