import type { BoxPlotChartCustom } from '../types';
import {
	Axis,
	Container,
	CrossAxisAlignment,
	Flex,
	Flexible,
	MainAxisAlignment,
	Stack,
	StackFit,
} from 'flitter-core';

export function BoxPlotGroup(
	...[{ boxPlots }, ctx]: Parameters<BoxPlotChartCustom['boxPlotGroup']>
) {
	const isVertical = ctx.direction === 'vertical';
	return Container({
		width: Infinity,
		height: Infinity,
		child: Flex({
			mainAxisAlignment: MainAxisAlignment.center,
			crossAxisAlignment: isVertical
				? CrossAxisAlignment.end
				: CrossAxisAlignment.start,
			direction: isVertical ? Axis.horizontal : Axis.vertical,
			children: boxPlots.map(({ boxPlot, outliers }) =>
				Flexible({
					flex: 1,
					child: Stack({
						fit: StackFit.expand,
						clipped: false,
						children: [boxPlot, ...outliers],
					}),
				}),
			),
		}),
	});
}
