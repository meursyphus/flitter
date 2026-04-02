import type { CandlestickChartCustom } from '../types';
import { agLegend, defaultAgCartesianBaseConfig } from '../../_styles/ag/index';

export function Legend(...args: Parameters<CandlestickChartCustom['legend']>) {
	const [legend, context] = args;
	return agLegend(legend, {
		config: defaultAgCartesianBaseConfig,
		isSeriesVisible: context.isSeriesVisible.bind(context),
	});
}
