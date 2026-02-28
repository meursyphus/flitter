import type { BarChartCustom } from '../types';

export function BarGroup(
	...[{ child }]: Parameters<BarChartCustom['barGroup']>
) {
	return child;
}
