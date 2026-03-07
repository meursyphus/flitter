import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { PolarAreaChartCustom, PolarAreaChartData } from "./types";
import { PolarAreaChartController } from "./controller";
import Chart from "./chart";

const POLAR_AREA_CHART_KEY = Symbol("PolarAreaChartKey");

export function PolarAreaChartProvider({
	custom,
	data,
	config = {},
}: {
	custom: PolarAreaChartCustom<any>;
	data: PolarAreaChartData;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: POLAR_AREA_CHART_KEY,
		create: () =>
			new PolarAreaChartController({
				data,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as PolarAreaChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

PolarAreaChartProvider.of = (
	context: BuildContext,
): PolarAreaChartController => {
	return Provider.of(POLAR_AREA_CHART_KEY, context) as PolarAreaChartController;
};
