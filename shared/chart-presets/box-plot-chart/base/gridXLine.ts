import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function GridXLine(...args: Parameters<BoxPlotChartCustom['gridXLine']>) {
	return Cartesian.GridXLine();
}
