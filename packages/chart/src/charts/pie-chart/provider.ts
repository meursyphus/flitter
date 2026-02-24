import { type Widget, Provider, BuildContext } from 'flitter-core';
import type { PieChartConfig } from './types';

const PIE_CHART_CONTEXT_KEY = Symbol('PieChartKey');

export function PieChartConfigProvider({ child, value }: { child: Widget; value: PieChartConfig }): Widget {
	return Provider({
		child,
		providerKey: PIE_CHART_CONTEXT_KEY,
		value
	});
}

PieChartConfigProvider.of = (context: BuildContext): PieChartConfig => {
	return Provider.of(PIE_CHART_CONTEXT_KEY, context);
};
