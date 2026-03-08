import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function Layout(...args: Parameters<BoxPlotChartCustom['layout']>) {
	return Cartesian.Layout(args[0]);
}
