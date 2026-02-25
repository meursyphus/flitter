import { type Widget, Provider, BuildContext } from 'flitter-core';
import type { LineChartConfig } from './types';

const BAR_CHART_CONTEXT_KEY = Symbol('BarChartKey');

export function LineChartConfigProvider({ child, value }: { child: Widget; value: LineChartConfig }): Widget {
	return Provider({
		child,
		providerKey: BAR_CHART_CONTEXT_KEY,
		value
	});
}

LineChartConfigProvider.of = (context: BuildContext): LineChartConfig => {
	return Provider.of(BAR_CHART_CONTEXT_KEY, context);
};
