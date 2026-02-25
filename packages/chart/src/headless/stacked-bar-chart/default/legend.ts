import type { StackedBarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function Legend(...args: Parameters<StackedBarChartCustom['legend']>) {
	return Cartesian.Legend(args[0]);
}
