import type { BarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function YAxisTick(...args: Parameters<BarChartCustom['yAxisTick']>) {
	return Cartesian.YAxisTick(args[0]);
}
