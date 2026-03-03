import type { BoxPlotChartCustom } from '../types';
import { Container, Flexible, Flex, Axis } from 'flitter-core';

export function DataView(...[{ boxPlotGroups }]: Parameters<BoxPlotChartCustom['dataView']>) {
	return Container({
		height: Infinity,
		width: Infinity,
		child: Flex({
			direction: Axis.horizontal,
			children: boxPlotGroups.map((group) =>
				Flexible({
					flex: 1,
					child: group
				})
			)
		})
	});
}
