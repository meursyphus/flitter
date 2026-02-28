import type { ScatterChartCustom } from '../types';

export function YAxisBox(
	...[{ child }]: Parameters<ScatterChartCustom['yAxisBox']>
) {
	return child;
}
