import type { StackedBarChartCustom } from '../types';
import {
	FractionallySizedBox,
} from 'flitter-core';

export function BarBox(
	...[{ bar, ratio, alignment }, { direction }]: Parameters<StackedBarChartCustom['barBox']>
) {
	const isVertical = direction === 'vertical';
	return FractionallySizedBox({
		alignment,
		widthFactor: isVertical ? undefined : ratio,
		heightFactor: isVertical ? ratio : undefined,
		child: bar,
	});
}
