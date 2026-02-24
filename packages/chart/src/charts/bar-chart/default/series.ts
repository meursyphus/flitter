import type { BarChartCustom } from '../types';
import { Container, Flexible, Flex, Axis } from 'flitter-core';

export function Series(...[{ barGroups }, { direction }]: Parameters<BarChartCustom['series']>) {
	return Container({
		height: Infinity,
		width: Infinity,
		child: Flex({
			direction: direction === 'vertical' ? Axis.horizontal : Axis.vertical,
			children: barGroups.map((barGroup) =>
				Flexible({
					flex: 1,
					child: barGroup
				})
			)
		})
	});
}
