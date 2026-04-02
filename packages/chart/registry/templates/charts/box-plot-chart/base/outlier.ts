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
import { HoverTooltip } from '@shared/interaction/hover-tooltip';
import { agTooltipContent, defaultAgCartesianBaseConfig } from '@styles/ag';

export function Outlier(
	...[{ value, index, legend, label, datasetIndex }, ctx]: Parameters<
		BoxPlotChartCustom['outlier']
	>
) {
	const { scale } = ctx;
	if (scale == null) return SizedBox.shrink();

	const hoveredBoxPlot = ctx.hoveredBoxPlot;
	const isHovered = ctx.isBoxPlotHovered(index, legend);
	const activeOpacity = hoveredBoxPlot == null || isHovered ? 1 : 0.3;
	const colors =
		(ctx.config as { colors?: { fills?: string[] } })?.colors?.fills ??
		defaultAgCartesianBaseConfig.colors.fills;
	const color = colors[datasetIndex % colors.length];

	const size = isHovered ? 8 : 6;

	return new HoverTooltip({
		tooltip: agTooltipContent({
			label,
			items: { legend: `${legend} outlier`, color, value },
			config: ctx.config ?? defaultAgCartesianBaseConfig,
		}),
		onMouseEnter: () =>
			ctx.hoverBoxPlot(index, legend, { kind: 'outlier', value }),
		onMouseLeave: () =>
			ctx.unhoverBoxPlot({ index, legend, kind: 'outlier', value }),
		renderChild: (_hovered) =>
			Opacity({
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
			}),
	});
}
