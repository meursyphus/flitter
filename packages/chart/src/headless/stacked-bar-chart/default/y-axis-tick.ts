import type { StackedBarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function YAxisTick(...args: Parameters<StackedBarChartCustom['yAxisTick']>) {
	return Cartesian.YAxisTick(args[0]);
}
