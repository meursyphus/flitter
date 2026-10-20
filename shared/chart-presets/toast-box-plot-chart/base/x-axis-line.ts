import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function XAxisLine(...args: Parameters<BoxPlotChartCustom['xAxisLine']>) {
	return Cartesian.XAxisLine();
}
