import { type Widget, Provider, BuildContext } from 'flitter-core';
import type { BarChartConfig } from './types';

const BAR_CHART_CONTEXT_KEY = Symbol('BarChartKey');

export function BarChartConfigProvider({ child, value }: { child: Widget; value: BarChartConfig }): Widget {
	return Provider({
		child,
		providerKey: BAR_CHART_CONTEXT_KEY,
		value
	});
}

BarChartConfigProvider.of = (context: BuildContext): BarChartConfig => {
	return Provider.of(BAR_CHART_CONTEXT_KEY, context);
};
