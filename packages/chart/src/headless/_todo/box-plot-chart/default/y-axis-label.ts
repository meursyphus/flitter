import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function YAxisLabel(...args: Parameters<BoxPlotChartCustom['yAxisLabel']>) {
	return Cartesian.YAxisLabel(args[0]);
}
