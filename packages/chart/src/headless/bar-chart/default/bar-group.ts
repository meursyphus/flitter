import type { BarChartCustom } from '../types';
import {
	Alignment,
	Axis,
	Container,
	CrossAxisAlignment,
	EdgeInsets,
	Expanded,
	Flex,
	FractionallySizedBox,
	MainAxisAlignment,
	Padding,
	SizedBox
} from 'flitter-core';

export function BarGroup(
	...[{ bars, values }, { direction, scale: _scale }]: Parameters<BarChartCustom['barGroup']>
) {
	const scale = _scale!;
	const total = scale.max - scale.min;
	const isVertical = direction === 'vertical';
	const hasNegative = scale.min < 0;

	return Container({
		width: Infinity,
		height: Infinity,
		child: Flex({
			mainAxisAlignment: MainAxisAlignment.center,
			crossAxisAlignment:
				isVertical ? CrossAxisAlignment.end : CrossAxisAlignment.start,
			direction: isVertical ? Axis.horizontal : Axis.vertical,
			children: bars.map((bar, index) => {
				const value = values[index];
				const barWidget = Padding({
					padding: EdgeInsets.symmetric(
						isVertical ? { horizontal: 2 } : { vertical: 2 }
					),
					child: bar
				});

				if (!hasNegative) {
					return FractionallySizedBox({
						alignment: isVertical ? Alignment.bottomCenter : Alignment.centerLeft,
						widthFactor: isVertical ? undefined : value / total,
						heightFactor: isVertical ? value / total : undefined,
						child: barWidget
					});
				}

				const positiveMax = scale.max;
				const negativeMax = Math.abs(scale.min);
				const isPositive = value >= 0;

				const positiveChild = isPositive
					? FractionallySizedBox({
							alignment: isVertical ? Alignment.bottomCenter : Alignment.centerLeft,
							widthFactor: isVertical ? undefined : value / positiveMax,
							heightFactor: isVertical ? value / positiveMax : undefined,
							child: barWidget
						})
					: SizedBox.shrink();

				const negativeChild = !isPositive
					? FractionallySizedBox({
							alignment: isVertical ? Alignment.topCenter : Alignment.centerRight,
							widthFactor: isVertical ? undefined : Math.abs(value) / negativeMax,
							heightFactor: isVertical ? Math.abs(value) / negativeMax : undefined,
							child: barWidget
						})
					: SizedBox.shrink();

				if (isVertical) {
					return Flex({
						direction: Axis.vertical,
						children: [
							Expanded({ flex: positiveMax, child: positiveChild }),
							Expanded({ flex: negativeMax, child: negativeChild })
						]
					});
				} else {
					return Flex({
						direction: Axis.horizontal,
						children: [
							Expanded({ flex: negativeMax, child: negativeChild }),
							Expanded({ flex: positiveMax, child: positiveChild })
						]
					});
				}
			})
		})
	});
}
