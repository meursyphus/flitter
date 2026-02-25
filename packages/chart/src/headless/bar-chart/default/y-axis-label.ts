import type { BarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function YAxisLabel(...args: Parameters<BarChartCustom['yAxisLabel']>) {
	return Cartesian.YAxisLabel(args[0]);
}
