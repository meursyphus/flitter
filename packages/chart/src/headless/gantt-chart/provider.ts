import {
	type Widget,
	Provider,
	BuildContext,
	ChangeNotifierProvider,
} from "flitter-core";
import type { GanttChartCustom, GanttChartData } from "./types";
import { GanttChartController } from "./controller";
import Chart from "./chart";

const GANTT_CHART_KEY = Symbol("GanttChartKey");

export function GanttChartProvider({
	custom,
	data,
	config = {},
}: {
	custom: GanttChartCustom<any>;
	data: GanttChartData;
	config?: any;
}): Widget {
	return ChangeNotifierProvider({
		providerKey: GANTT_CHART_KEY,
		create: () =>
			new GanttChartController({
				data,
				custom,
				config,
			}),
		update: (notifier) => {
			const controller = notifier as GanttChartController;
			controller.data = data;
			controller.custom = custom;
			controller.config = config;
		},
		child: new Chart(),
	});
}

GanttChartProvider.of = (context: BuildContext): GanttChartController => {
	return Provider.of(GANTT_CHART_KEY, context) as GanttChartController;
};
