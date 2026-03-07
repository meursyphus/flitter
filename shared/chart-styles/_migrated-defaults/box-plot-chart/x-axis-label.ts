import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function XAxisLabel(...args: Parameters<BoxPlotChartCustom['xAxisLabel']>) {
	return Cartesian.XAxisLabel(args[0]);
}
