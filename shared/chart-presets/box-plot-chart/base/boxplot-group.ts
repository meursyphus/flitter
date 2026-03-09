import type { BoxPlotChartCustom } from '../types';
import {
	Axis,
	Container,
	CrossAxisAlignment,
	Flex,
	MainAxisAlignment,
	Positioned,
	Stack,
} from 'flitter-core';

export function BoxPlotGroup(
	...[{ boxPlots, outliers }]: Parameters<BoxPlotChartCustom['boxPlotGroup']>
) {
	return Container({
		width: Infinity,
		height: Infinity,
		child: Stack({
			children: [
				Positioned.fill({
					child: Flex({
						mainAxisAlignment: MainAxisAlignment.center,
						crossAxisAlignment: CrossAxisAlignment.end,
						direction: Axis.horizontal,
						children: boxPlots,
					}),
				}),
				...outliers,
			],
		}),
	});
}
