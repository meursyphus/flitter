import type { StackedBarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function XAxisTick(...args: Parameters<StackedBarChartCustom['xAxisTick']>) {
	return Cartesian.XAxisTick(args[0]);
}
