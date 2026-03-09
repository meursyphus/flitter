import type { WaterfallChartCustom } from '../types';
import { agLegend, defaultAgCartesianBaseConfig } from '../../_styles/ag/index';

export function Legend(...args: Parameters<WaterfallChartCustom['legend']>) {
	return agLegend(args[0], {
		config: defaultAgCartesianBaseConfig,
		isSeriesVisible: () => true,
		toggleSeries: () => {},
	});
}
