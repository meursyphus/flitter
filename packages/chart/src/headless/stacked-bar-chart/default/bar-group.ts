import type { StackedBarChartCustom } from '../types';
import {
	Alignment,
	Axis,
	Container,
	CrossAxisAlignment,
	Flex,
	FractionallySizedBox,
	MainAxisAlignment,
	SizedBox,
} from 'flitter-core';

export function BarGroup(
	...[{ bars, values }, ctx]: Parameters<StackedBarChartCustom['barGroup']>
) {
	const { direction, scale } = ctx;
	if (scale == null) return SizedBox.shrink();

	const total = scale.max - scale.min;
	const ratios = values.map((value) => value / total);

	return Container({
		width: Infinity,
		height: Infinity,
		child: FractionallySizedBox({
			alignment: direction === 'vertical' ? Alignment.bottomCenter : Alignment.centerLeft,
			widthFactor: direction === 'vertical' ? 0.6 : undefined,
			heightFactor: direction === 'horizontal' ? 0.6 : undefined,
			child: Flex({
				mainAxisAlignment: MainAxisAlignment.start,
				crossAxisAlignment: CrossAxisAlignment.stretch,
				direction: direction === 'vertical' ? Axis.vertical : Axis.horizontal,
				children: [...bars].reverse().map((bar, i) => {
					const reversedIndex = bars.length - 1 - i;
					return FractionallySizedBox({
						alignment: direction === 'horizontal' ? Alignment.centerLeft : Alignment.bottomCenter,
						widthFactor: direction === 'horizontal' ? ratios[reversedIndex] : undefined,
						heightFactor: direction === 'vertical' ? ratios[reversedIndex] : undefined,
						child: bar
					});
				})
			})
		})
	});
}
