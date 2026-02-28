import type { StackedBarChartCustom } from '../types';

export function BarGroup(
	...[{ child }]: Parameters<StackedBarChartCustom['barGroup']>
) {
	return child;
}
