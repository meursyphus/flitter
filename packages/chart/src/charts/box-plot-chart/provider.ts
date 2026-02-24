import { type Widget, Provider, BuildContext } from 'flitter-core';
import type { BoxPlotChartConfig } from './types';

const BOX_PLOT_CHART_CONTEXT_KEY = Symbol('BoxPlotChartKey');

export function BoxPlotChartConfigProvider({ child, value }: { child: Widget; value: BoxPlotChartConfig }): Widget {
	return Provider({
		child,
		providerKey: BOX_PLOT_CHART_CONTEXT_KEY,
		value
	});
}

BoxPlotChartConfigProvider.of = (context: BuildContext): BoxPlotChartConfig => {
	return Provider.of(BOX_PLOT_CHART_CONTEXT_KEY, context);
};
