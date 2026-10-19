import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function XAxisLabel(...args: Parameters<BoxPlotChartCustom['xAxisLabel']>) {
	return Cartesian.XAxisLabel(args[0]);
}
