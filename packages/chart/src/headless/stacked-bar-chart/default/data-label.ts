import type { StackedBarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function DataLabel(...args: Parameters<StackedBarChartCustom['dataLabel']>) {
	return Cartesian.DataLabel(args[0]);
}
