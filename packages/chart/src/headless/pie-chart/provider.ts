import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { PieChartCustom, PieChartData } from "./types";
import { PieChartController } from "./controller";
import Chart from "./chart";

const PIE_CHART_KEY = Symbol("PieChartKey");

export function PieChartProvider({
	custom,
	data,
	config = {},
}: {
	custom: PieChartCustom<any>;
	data: PieChartData;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: PIE_CHART_KEY,
		create: () =>
			new PieChartController({
				data,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as PieChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

PieChartProvider.of = (context: BuildContext): PieChartController => {
	return Provider.of(PIE_CHART_KEY, context) as PieChartController;
};
