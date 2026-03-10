import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function XAxisTick(...args: Parameters<BoxPlotChartCustom['xAxisTick']>) {
	return Cartesian.XAxisTick(args[0]);
}
