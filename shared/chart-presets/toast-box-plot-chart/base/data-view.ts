import type { BoxPlotChartCustom } from '../types';
import { Container, Flexible, Flex, Axis } from 'flitter-ui';

export function DataView(...[{ boxPlotGroups }, ctx]: Parameters<BoxPlotChartCustom['dataView']>) {
	const isVertical = ctx.direction === 'vertical';
	return Container({
		height: Infinity,
		width: Infinity,
		child: Flex({
			direction: isVertical ? Axis.horizontal : Axis.vertical,
			children: boxPlotGroups.map((group) =>
				Flexible({
					flex: 1,
					child: group
				})
			)
		})
	});
}
