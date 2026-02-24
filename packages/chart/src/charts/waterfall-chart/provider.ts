import { type Widget, Provider, BuildContext } from 'flitter-core';
import type { WaterfallChartConfig } from './types';

const WATERFALL_CHART_CONTEXT_KEY = Symbol('WaterfallChartKey');

export function WaterfallChartConfigProvider({ child, value }: { child: Widget; value: WaterfallChartConfig }): Widget {
	return Provider({
		child,
		providerKey: WATERFALL_CHART_CONTEXT_KEY,
		value
	});
}

WaterfallChartConfigProvider.of = (context: BuildContext): WaterfallChartConfig => {
	return Provider.of(WATERFALL_CHART_CONTEXT_KEY, context);
};
