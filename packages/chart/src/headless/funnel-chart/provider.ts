import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type {
	FunnelChartCustom,
	FunnelChartData,
	FunnelChartDirection,
} from "./types";
import { FunnelChartController } from "./controller";
import Chart from "./chart";

const FUNNEL_CHART_KEY = Symbol("FunnelChartKey");

export function FunnelChartProvider({
	custom,
	data,
	direction = "vertical",
	config = {},
}: {
	custom: FunnelChartCustom<any>;
	data: FunnelChartData;
	direction?: FunnelChartDirection;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: FUNNEL_CHART_KEY,
		create: () =>
			new FunnelChartController({
				data,
				custom,
				direction,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as FunnelChartController;
			controller.data = data;
			controller.custom = custom;
			controller.direction = direction;
			controller.config = config;
		},
		child: new Chart(),
	});
}

FunnelChartProvider.of = (context: BuildContext): FunnelChartController => {
	return Provider.of(FUNNEL_CHART_KEY, context) as FunnelChartController;
};
