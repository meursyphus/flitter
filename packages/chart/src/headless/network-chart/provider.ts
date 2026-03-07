import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { NetworkChartCustom, NetworkChartData } from "./types";
import { NetworkChartController } from "./controller";
import Chart from "./chart";

const NETWORK_CHART_KEY = Symbol("NetworkChartKey");

export function NetworkChartProvider({
	custom,
	data,
	config = {},
}: {
	custom: NetworkChartCustom<any>;
	data: NetworkChartData;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: NETWORK_CHART_KEY,
		create: () =>
			new NetworkChartController({
				data,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as NetworkChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

NetworkChartProvider.of = (context: BuildContext): NetworkChartController => {
	return Provider.of(NETWORK_CHART_KEY, context) as NetworkChartController;
};
