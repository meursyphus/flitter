import type { BarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function DataLabel(...args: Parameters<BarChartCustom['dataLabel']>) {
	return Cartesian.DataLabel(args[0]);
}
