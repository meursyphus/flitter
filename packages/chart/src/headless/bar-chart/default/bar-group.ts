import type { BarChartCustom } from '../types';
import {
	Alignment,
	Axis,
	Container,
	CrossAxisAlignment,
	EdgeInsets,
	Flex,
	FractionallySizedBox,
	MainAxisAlignment,
	Padding
} from 'flitter-core';

export function BarGroup(
	...[{ bars, values }, { direction, scale }]: Parameters<BarChartCustom['barGroup']>
) {
	const total = scale.max - scale.min;
	const ratios = values.map((value) => value / total);

	return Container({
		width: Infinity,
		height: Infinity,
		child: Flex({
			mainAxisAlignment: MainAxisAlignment.center,
			crossAxisAlignment:
				direction === 'vertical' ? CrossAxisAlignment.end : CrossAxisAlignment.start,
			direction: direction === 'horizontal' ? Axis.vertical : Axis.horizontal,
			children: bars.map((bar, index) => {
				return FractionallySizedBox({
					alignment: direction === 'horizontal' ? Alignment.bottomLeft : Alignment.centerLeft,
					widthFactor: direction === 'horizontal' ? ratios[index] : undefined,
					heightFactor: direction === 'vertical' ? ratios[index] : undefined,
					child: Padding({
						padding: EdgeInsets.symmetric(
							direction === 'vertical' ? { horizontal: 2 } : { vertical: 2 }
						),
						child: bar
					})
				});
			})
		})
	});
}
