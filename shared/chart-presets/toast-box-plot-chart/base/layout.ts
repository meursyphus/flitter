import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function Layout(...args: Parameters<BoxPlotChartCustom['layout']>) {
	return Cartesian.Layout(args[0]);
}
