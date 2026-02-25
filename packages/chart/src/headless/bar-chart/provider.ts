import { type Widget, Provider, BuildContext } from 'flitter-core';
import type { BarChartContext } from './types';

const BAR_CHART_CONTEXT_KEY = Symbol('BarChartKey');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BarChartConfigProvider({ child, value }: { child: Widget; value: BarChartContext<any> }): Widget {
	return Provider({
		child,
		providerKey: BAR_CHART_CONTEXT_KEY,
		value
	});
}

BarChartConfigProvider.of = (context: BuildContext): BarChartContext<any> => {
	return Provider.of(BAR_CHART_CONTEXT_KEY, context);
};
