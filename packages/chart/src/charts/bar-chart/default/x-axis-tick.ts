import type { BarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function XAxisTick(...args: Parameters<BarChartCustom['xAxisTick']>) {
	return Cartesian.XAxisTick(args[0]);
}
