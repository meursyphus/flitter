import type { BoxPlotChartCustom } from '../types';
import { agLegend, defaultAgCartesianBaseConfig } from '../../_styles/ag/index';

export function Legend(...args: Parameters<BoxPlotChartCustom['legend']>) {
	const [legend, context] = args;
	return agLegend(legend, {
		config: defaultAgCartesianBaseConfig,
		isSeriesVisible: context.isSeriesVisible.bind(context),
	});
}
