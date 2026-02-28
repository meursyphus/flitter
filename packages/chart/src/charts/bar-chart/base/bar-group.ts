import {
	Alignment,
	Axis as FlexAxis,
	Container,
	CrossAxisAlignment,
	Expanded,
	Flex,
	Flexible,
	MainAxisAlignment,
	SizedBox,
	type Widget,
} from 'flitter-core';
import type { BarChartCustom } from '@headless/bar-chart/types';

export function BarGroup(
	...[{ bars }, ctx]: Parameters<BarChartCustom['barGroup']>
): Widget {
	const { scale, direction } = ctx;
	if (scale == null) return SizedBox.shrink();

	const isVertical = direction === 'vertical';
	const total = scale.max - scale.min;
	const hasNegative = scale.min < 0;

	const barChildren = bars.map(({ bar, value, datasetIndex }) => {
		if (!hasNegative) {
			const ratio = value / total;
			const alignment = isVertical
				? Alignment.bottomCenter
				: Alignment.centerLeft;
			return Flexible({
				flex: 1,
				child: ctx.custom.barBox({ bar, value, ratio, alignment, index: datasetIndex }, ctx),
			});
		}

		const positiveMax = scale.max;
		const negativeMax = Math.abs(scale.min);
		const isPositive = value >= 0;

		const ratio = isPositive
			? value / positiveMax
			: Math.abs(value) / negativeMax;
		const alignment = isPositive
			? isVertical
				? Alignment.bottomCenter
				: Alignment.centerLeft
			: isVertical
				? Alignment.topCenter
				: Alignment.centerRight;

		const barBox = ctx.custom.barBox({ bar, value, ratio, alignment, index: datasetIndex }, ctx);

		const positiveChild = isPositive ? barBox : SizedBox.shrink();
		const negativeChild = !isPositive ? barBox : SizedBox.shrink();

		if (isVertical) {
			return Flexible({
				flex: 1,
				child: Flex({
					direction: FlexAxis.vertical,
					children: [
						Expanded({ flex: positiveMax, child: positiveChild }),
						Expanded({ flex: negativeMax, child: negativeChild }),
					],
				}),
			});
		} else {
			return Flexible({
				flex: 1,
				child: Flex({
					direction: FlexAxis.horizontal,
					children: [
						Expanded({ flex: negativeMax, child: negativeChild }),
						Expanded({ flex: positiveMax, child: positiveChild }),
					],
				}),
			});
		}
	});

	return Container({
		width: Infinity,
		height: Infinity,
		child: Flex({
			mainAxisAlignment: MainAxisAlignment.center,
			crossAxisAlignment: isVertical
				? CrossAxisAlignment.end
				: CrossAxisAlignment.start,
			direction: isVertical ? FlexAxis.horizontal : FlexAxis.vertical,
			children: barChildren,
		}),
	});
}
