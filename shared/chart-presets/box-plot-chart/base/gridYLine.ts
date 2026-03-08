import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function GridYLine(...args: Parameters<BoxPlotChartCustom['gridYLine']>) {
	return Cartesian.GridYLine();
}
