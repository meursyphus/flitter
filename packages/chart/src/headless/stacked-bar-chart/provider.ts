import { type Widget, Provider, BuildContext } from 'flitter-core';
import type { StackedBarChartConfig } from './types';

const STACKED_BAR_CHART_CONTEXT_KEY = Symbol('StackedBarChartKey');

export function StackedBarChartConfigProvider({ child, value }: { child: Widget; value: StackedBarChartConfig }): Widget {
	return Provider({
		child,
		providerKey: STACKED_BAR_CHART_CONTEXT_KEY,
		value
	});
}

StackedBarChartConfigProvider.of = (context: BuildContext): StackedBarChartConfig => {
	return Provider.of(STACKED_BAR_CHART_CONTEXT_KEY, context);
};
