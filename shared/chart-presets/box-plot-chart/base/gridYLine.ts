import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function GridYLine(...args: Parameters<BoxPlotChartCustom['gridYLine']>) {
	return Cartesian.GridYLine();
}
