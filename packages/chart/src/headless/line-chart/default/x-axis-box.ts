import type { LineChartCustom } from '../types';

export function XAxisBox(
	...[{ child }]: Parameters<LineChartCustom['xAxisBox']>
) {
	return child;
}
