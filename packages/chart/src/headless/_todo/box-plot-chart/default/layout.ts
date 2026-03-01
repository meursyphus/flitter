import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function Layout(...args: Parameters<BoxPlotChartCustom['layout']>) {
	return Cartesian.Layout(args[0]);
}
