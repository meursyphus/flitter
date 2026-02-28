import type { ScatterChartCustom } from '../types';

export function XAxisBox(
	...[{ child }]: Parameters<ScatterChartCustom['xAxisBox']>
) {
	return child;
}
