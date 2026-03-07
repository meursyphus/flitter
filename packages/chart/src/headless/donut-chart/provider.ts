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

export function DonutChartProvider({
	custom,
	data,
	innerRadiusRatio = 0.6,
	config = {},
}: {
	custom: DonutChartCustom<any>;
	data: DonutChartData;
	innerRadiusRatio?: number;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: DONUT_CHART_KEY,
		create: () =>
			new DonutChartController({
				data,
				custom,
				innerRadiusRatio,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as DonutChartController;
			controller.data = data;
			controller.innerRadiusRatio = innerRadiusRatio;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

DonutChartProvider.of = (context: BuildContext): DonutChartController => {
	return Provider.of(DONUT_CHART_KEY, context) as DonutChartController;
};
