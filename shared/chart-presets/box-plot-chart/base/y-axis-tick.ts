import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function YAxisTick(...args: Parameters<BoxPlotChartCustom['yAxisTick']>) {
	return Cartesian.YAxisTick(args[0]);
}
