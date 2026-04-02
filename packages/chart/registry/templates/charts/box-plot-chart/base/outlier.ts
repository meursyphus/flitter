import type { BoxPlotChartCustom } from '../types';
import {
	Border,
	BorderRadius,
	BoxDecoration,
	Container,
	Opacity,
	Radius,
	SizedBox,
} from 'flitter-core';
import { defaultAgCartesianBaseConfig } from '@styles/ag';

export function Outlier(
	...[{ value, index, legend, label, datasetIndex, isHovered }, ctx]: Parameters<
		BoxPlotChartCustom['outlier']
	>
) {
	const { scale } = ctx;
	if (scale == null) return SizedBox.shrink();

	const hoveredBoxPlot = ctx.hoveredBoxPlot;
	const activeOpacity = hoveredBoxPlot == null || isHovered ? 1 : 0.3;
	const colors =
		(ctx.config as { colors?: { fills?: string[] } })?.colors?.fills ??
		defaultAgCartesianBaseConfig.colors.fills;
	const color = colors[datasetIndex % colors.length];

	const size = isHovered ? 8 : 6;

	return Opacity({
		opacity: activeOpacity,
		child: Container({
			width: size,
			height: size,
			decoration: new BoxDecoration({
				color: isHovered ? `${color}30` : undefined,
				border: Border.all({ color, width: 1.5 }),
				borderRadius: BorderRadius.all(Radius.circular(size / 2)),
			}),
		}),
	});
}
