import type { StackedBarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function YAxisLabel(...args: Parameters<StackedBarChartCustom['yAxisLabel']>) {
	return Cartesian.YAxisLabel(args[0]);
}
