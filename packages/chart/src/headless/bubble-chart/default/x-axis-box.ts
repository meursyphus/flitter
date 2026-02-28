import type { BubbleChartCustom } from '../types';

export function XAxisBox(
	...[{ child }]: Parameters<BubbleChartCustom['xAxisBox']>
) {
	return child;
}
