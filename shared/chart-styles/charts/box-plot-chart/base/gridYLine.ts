import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function GridYLine(...args: Parameters<BoxPlotChartCustom['gridYLine']>) {
	return Cartesian.GridYLine();
}
