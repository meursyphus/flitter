import type { BarChartCustom } from '../types';

export function XAxisBox(
	...[{ child }]: Parameters<BarChartCustom['xAxisBox']>
) {
	return child;
}
