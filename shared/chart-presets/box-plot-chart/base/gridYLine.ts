import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function GridYLine(...args: Parameters<BoxPlotChartCustom['gridYLine']>) {
	return Cartesian.GridYLine();
}
