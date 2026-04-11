import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { DonutChartCustom, DonutChartData } from "./types";
import { DonutChartController } from "./controller";
import Chart from "./chart";

const DONUT_CHART_KEY = Symbol("DonutChartKey");

export function DonutChartProvider<TConfig extends object = object>({
	custom,
	data,
	config,
}: {
	custom: DonutChartCustom<TConfig>;
	data: DonutChartData;
	config?: TConfig;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: DONUT_CHART_KEY,
		create: () =>
			new DonutChartController({
				data,
				custom,
				config: config ?? {},
			}),
		update: (notifier) => {
			const controller = notifier as DonutChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config ?? {};
		},
		child: new Chart(),
	});
}

DonutChartProvider.of = (context: BuildContext): DonutChartController => {
	return Provider.of(DONUT_CHART_KEY, context) as DonutChartController;
};
