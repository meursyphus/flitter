import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { ComboChartCustom, ComboChartData } from "./types";
import { ComboChartController } from "./controller";
import Chart from "./chart";

const COMBO_CHART_KEY = Symbol("ComboChartKey");

export function ComboChartProvider({
	custom,
	data,
	config = {},
}: {
	custom: ComboChartCustom<any>;
	data: ComboChartData;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: COMBO_CHART_KEY,
		create: () =>
			new ComboChartController({
				data,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as ComboChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

ComboChartProvider.of = (context: BuildContext): ComboChartController => {
	return Provider.of(COMBO_CHART_KEY, context) as ComboChartController;
};
