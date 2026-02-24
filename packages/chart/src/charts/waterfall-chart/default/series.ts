import type { WaterfallChartCustom } from '../types';
import { Container, Flexible, Flex, Axis } from 'flitter-core';

export function Series(
	...[{ bars }, _config]: Parameters<WaterfallChartCustom['series']>
) {
	return Container({
		height: Infinity,
		width: Infinity,
		child: Flex({
			direction: Axis.horizontal,
			children: bars.map((bar) =>
				Flexible({
					flex: 1,
					child: bar
				})
			)
		})
	});
}
