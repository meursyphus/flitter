import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function XAxisTick(...args: Parameters<BoxPlotChartCustom['xAxisTick']>) {
	return Cartesian.XAxisTick(args[0]);
}
