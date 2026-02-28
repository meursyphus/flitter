import type { LineChartCustom } from '../types';

export function YAxisBox(
	...[{ child }]: Parameters<LineChartCustom['yAxisBox']>
) {
	return child;
}
