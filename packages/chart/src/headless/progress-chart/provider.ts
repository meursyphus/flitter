import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { ProgressChartCustom, ProgressChartData } from "./types";
import { ProgressChartController } from "./controller";
import Chart from "./chart";

const PROGRESS_CHART_KEY = Symbol("ProgressChartKey");

export function ProgressChartProvider({
	custom,
	data,
	config = {},
}: {
	custom: ProgressChartCustom<any>;
	data: ProgressChartData;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: PROGRESS_CHART_KEY,
		create: () =>
			new ProgressChartController({
				data,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as ProgressChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

ProgressChartProvider.of = (
	context: BuildContext,
): ProgressChartController => {
	return Provider.of(PROGRESS_CHART_KEY, context) as ProgressChartController;
};
