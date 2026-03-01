import { type Widget, Provider, BuildContext } from 'flitter-core';
import type { CandlestickChartConfig } from './types';

const CANDLESTICK_CHART_CONTEXT_KEY = Symbol('CandlestickChartKey');

export function CandlestickChartConfigProvider({
	child,
	value
}: {
	child: Widget;
	value: CandlestickChartConfig;
}): Widget {
	return Provider({
		child,
		providerKey: CANDLESTICK_CHART_CONTEXT_KEY,
		value
	});
}

CandlestickChartConfigProvider.of = (context: BuildContext): CandlestickChartConfig => {
	return Provider.of(CANDLESTICK_CHART_CONTEXT_KEY, context);
};
