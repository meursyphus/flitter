import type { StackedBarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function Title(...args: Parameters<StackedBarChartCustom['title']>) {
	return Cartesian.Title(args[0]);
}
