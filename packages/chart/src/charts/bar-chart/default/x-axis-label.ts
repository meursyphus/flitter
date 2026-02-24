import type { BarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function XAxisLabel(...args: Parameters<BarChartCustom['xAxisLabel']>) {
	return Cartesian.XAxisLabel(args[0]);
}
