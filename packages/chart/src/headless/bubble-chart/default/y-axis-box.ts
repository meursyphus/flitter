import type { BubbleChartCustom } from '../types';

export function YAxisBox(
	...[{ child }]: Parameters<BubbleChartCustom['yAxisBox']>
) {
	return child;
}
