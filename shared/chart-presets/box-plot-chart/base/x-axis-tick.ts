import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function XAxisTick(...args: Parameters<BoxPlotChartCustom['xAxisTick']>) {
	return Cartesian.XAxisTick(args[0]);
}
