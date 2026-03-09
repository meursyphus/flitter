import type { BoxPlotChartCustom } from '../types';
import {
	Container,
	BoxDecoration,
	Border,
	BorderRadius,
	LayoutBuilder,
	Opacity,
	Positioned,
	Radius,
	SizedBox,
	Stack,
} from 'flitter-core';
import { HoverTooltip } from '@shared/interaction/hover-tooltip';
import { agTooltipContent, defaultAgCartesianBaseConfig } from '@styles/ag';

export function Outlier(
	...[{ value, index, legend, label, datasetIndex }, ctx]: Parameters<BoxPlotChartCustom['outlier']>
) {
	const { scale } = ctx;
	if (scale == null) return SizedBox.shrink();

	const total = scale.max - scale.min || 1;
	const ratio = (value - scale.min) / total;
	const hoveredBoxPlot = ctx.hoveredBoxPlot;
	const isHovered = ctx.isBoxPlotHovered(index, legend);
	const activeOpacity = hoveredBoxPlot == null || isHovered ? 1 : 0.3;

	return new HoverTooltip({
		position: 'topCenter',
		tooltip: agTooltipContent({
			label,
			items: { legend: `${legend} outlier`, color: '#E74C3C', value },
			config: defaultAgCartesianBaseConfig,
		}),
		onMouseEnter: () => ctx.hoverBoxPlot(index, legend),
		onMouseLeave: () => ctx.unhoverBoxPlot(),
		renderChild: (hovered) =>
			Opacity({
				opacity: activeOpacity,
				child: LayoutBuilder({
					builder: (_ctx, constraints) => {
						const datasetCount = Math.max(1, ctx.data.datasets.length);
						const boxWidth = constraints.maxWidth / datasetCount;
						const size = hovered ? 8 : 6;
						const left = boxWidth * datasetIndex + boxWidth / 2 - size / 2;
						const top = (1 - ratio) * constraints.maxHeight - size / 2;

						return SizedBox.expand({
							child: Stack({
								children: [
									Positioned({
										left: Math.max(0, left),
										top: Math.max(0, top),
										child: Container({
											width: size,
											height: size,
											decoration: new BoxDecoration({
												color: hovered ? 'rgba(231, 76, 60, 0.18)' : undefined,
												border: Border.all({ color: '#E74C3C', width: 1.5 }),
												borderRadius: BorderRadius.all(Radius.circular(size / 2)),
											}),
										}),
									}),
								],
							}),
						});
					},
				}),
			}),
	});
}
