import type { BarChartCustom } from '../types';

export function BarGroupBox(
	...[{ child }]: Parameters<BarChartCustom['barGroupBox']>
) {
	return child;
}
