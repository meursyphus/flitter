import type { StackedBarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function XAxisLabel(...args: Parameters<StackedBarChartCustom['xAxisLabel']>) {
	return Cartesian.XAxisLabel(args[0]);
}
