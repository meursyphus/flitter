import type { BoxPlotChartCustom } from '../types';
import {
	Axis,
	Container,
	Flex,
	Flexible,
	MainAxisAlignment,
	SizedBox,
} from 'flitter-core';

export function BoxPlotGroup(
	...[{ boxPlots, dataPoints, index }, ctx]: Parameters<BoxPlotChartCustom['boxPlotGroup']>
) {
	const { scale, direction } = ctx;
	if (scale == null) return SizedBox.shrink();

	const isVertical = direction === 'vertical';
	const total = scale.max - scale.min;

	return Container({
		width: Infinity,
		height: Infinity,
		child: Flex({
			mainAxisAlignment: MainAxisAlignment.center,
			direction: isVertical ? Axis.horizontal : Axis.vertical,
			children: boxPlots.map(({ boxPlot, outliers }, datasetIndex) => {
				const dp = dataPoints[datasetIndex];
				const minRatio = (dp.min - scale.min) / total;
				const maxRatio = (dp.max - scale.min) / total;

				return Flexible({
					flex: 1,
					child: ctx.custom.boxPlotBox(
						{ boxPlot, outliers, minRatio, maxRatio, index, datasetIndex },
						ctx,
					),
				});
			}),
		}),
	});
}
