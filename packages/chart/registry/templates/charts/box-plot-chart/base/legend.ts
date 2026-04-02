import type { BoxPlotChartCustom } from '../types';
import { agLegend, defaultAgCartesianBaseConfig } from '@styles/ag';

export function Legend(...args: Parameters<BoxPlotChartCustom['legend']>) {
	const [legend, context] = args;
	return agLegend(legend, {
		config: defaultAgCartesianBaseConfig,
		isSeriesVisible: context.isSeriesVisible.bind(context),
	});
}
