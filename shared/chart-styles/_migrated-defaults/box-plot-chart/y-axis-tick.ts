import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function YAxisTick(...args: Parameters<BoxPlotChartCustom['yAxisTick']>) {
	return Cartesian.YAxisTick(args[0]);
}
