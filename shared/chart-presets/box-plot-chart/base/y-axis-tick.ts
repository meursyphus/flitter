import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function YAxisTick(...args: Parameters<BoxPlotChartCustom['yAxisTick']>) {
	return Cartesian.YAxisTick(args[0]);
}
