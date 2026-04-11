import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type {
	BoxPlotChartCustom,
	BoxPlotChartData,
	BoxPlotChartDirection,
	GetScaleFn,
	GetScaleOptionsFn,
} from "./types";
import { BoxPlotChartController } from "./controller";
import Chart from "./chart";

const BOX_PLOT_CHART_KEY = Symbol("BoxPlotChartKey");

export function BoxPlotChartProvider<TConfig extends object = object>({
	custom,
	getScale,
	getScaleOptions,
	data,
	direction = "vertical",
	config,
}: {
	custom: BoxPlotChartCustom<TConfig>;
	data: BoxPlotChartData;
	direction?: BoxPlotChartDirection;
	getScale: GetScaleFn;
	getScaleOptions?: GetScaleOptionsFn;
	config?: TConfig;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: BOX_PLOT_CHART_KEY,
		create: () =>
			new BoxPlotChartController({
				data,
				getScale,
				getScaleOptions,
				direction,
				custom,
				config: config ?? {},
			}),
		update: (notifier) => {
			const controller = notifier as BoxPlotChartController;
			controller.data = data;
			controller.direction = direction;
			controller.custom = custom;
			controller.config = config ?? {};
		},
		child: new Chart(),
	});
}

BoxPlotChartProvider.of = (context: BuildContext): BoxPlotChartController => {
	return Provider.of(BOX_PLOT_CHART_KEY, context) as BoxPlotChartController;
};
