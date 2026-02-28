import type { BarChartCustom } from '@headless/bar-chart/types';

export function BarGroupBox(
	...[{ child }]: Parameters<BarChartCustom['barGroupBox']>
) {
	return child;
}
