import type { BarChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index'

export function Title(...args: Parameters<BarChartCustom['title']>) {
	return Cartesian.Title(args[0]);
}
