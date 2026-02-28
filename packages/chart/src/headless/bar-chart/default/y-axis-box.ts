import type { BarChartCustom } from '../types';

export function YAxisBox(
	...[{ child }]: Parameters<BarChartCustom['yAxisBox']>
) {
	return child;
}
