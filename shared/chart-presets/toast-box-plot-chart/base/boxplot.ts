import type { BoxPlotChartCustom } from '../types';
import {
	BoxDecoration,
	Border,
	BoxShadow,
	Column,
	Container,
	CrossAxisAlignment,
	EdgeInsets,
	Flexible,
	Opacity,
	Row,
	SizedBox,
} from 'flitter-ui';
import { defaultAgCartesianBaseConfig } from '../../_shared/ag/index';

export function BoxPlot(
	...[{ dataPoint, index, legend, label, datasetIndex, isHovered }, ctx]: Parameters<
		BoxPlotChartCustom['boxPlot']
	>
) {
	const { scale, direction } = ctx;
	if (scale == null) return SizedBox.shrink();

	const isVertical = direction === 'vertical';
	const colors =
		(ctx.config as { colors?: { fills?: string[] } })?.colors?.fills ??
		defaultAgCartesianBaseConfig.colors.fills;
	const boxPlotConfig = (ctx.config as {
		boxPlot?: { boxWidth?: number; whiskerWidth?: number; gap?: number };
	})?.boxPlot;
	const boxColor = colors[datasetIndex % colors.length];
	const whiskerColor = '#333';
	const medianColor = '#E74C3C';
	const boxWidth = boxPlotConfig?.boxWidth ?? 20;
	const whiskerWidth = boxPlotConfig?.whiskerWidth ?? 12;
	const gap = boxPlotConfig?.gap ?? 4;
	const range = dataPoint.max - dataPoint.min || 1;
	const minToQ1 = (dataPoint.q1 - dataPoint.min) / range;
	const q1ToMedian = (dataPoint.median - dataPoint.q1) / range;
	const medianToQ3 = (dataPoint.q3 - dataPoint.median) / range;
	const q3ToMax = (dataPoint.max - dataPoint.q3) / range;
	const hoveredBoxPlot = ctx.hoveredBoxPlot;
	const activeOpacity = hoveredBoxPlot == null || isHovered ? 1 : 0.3;

	const buildSection = (flex: number, child: ReturnType<typeof Container>) =>
		flex > 0 ? [Flexible({ flex, child })] : [];

	const sections = isVertical
		? [
				Container({ width: whiskerWidth, height: 1, color: whiskerColor }),
				...buildSection(
					q3ToMax,
					Container({
						width: isHovered ? 2 : 1,
						height: Infinity,
						color: whiskerColor,
					}),
				),
				...buildSection(
					medianToQ3,
					Container({ width: boxWidth, height: Infinity, color: boxColor }),
				),
				Container({
					width: boxWidth,
					height: isHovered ? 3 : 2,
					color: medianColor,
				}),
				...buildSection(
					q1ToMedian,
					Container({ width: boxWidth, height: Infinity, color: boxColor }),
				),
				...buildSection(
					minToQ1,
					Container({
						width: isHovered ? 2 : 1,
						height: Infinity,
						color: whiskerColor,
					}),
				),
				Container({ width: whiskerWidth, height: 1, color: whiskerColor }),
			]
		: [
				Container({ width: 1, height: whiskerWidth, color: whiskerColor }),
				...buildSection(
					minToQ1,
					Container({
						width: Infinity,
						height: isHovered ? 2 : 1,
						color: whiskerColor,
					}),
				),
				...buildSection(
					q1ToMedian,
					Container({ width: Infinity, height: boxWidth, color: boxColor }),
				),
				Container({
					width: isHovered ? 3 : 2,
					height: boxWidth,
					color: medianColor,
				}),
				...buildSection(
					medianToQ3,
					Container({ width: Infinity, height: boxWidth, color: boxColor }),
				),
				...buildSection(
					q3ToMax,
					Container({
						width: Infinity,
						height: isHovered ? 2 : 1,
						color: whiskerColor,
					}),
				),
				Container({ width: 1, height: whiskerWidth, color: whiskerColor }),
			];

	return Opacity({
		opacity: activeOpacity,
		child: Container({
			width: isVertical ? boxWidth + gap * 2 : Infinity,
			height: isVertical ? Infinity : boxWidth + gap * 2,
			padding: EdgeInsets.symmetric(
				isVertical ? { horizontal: gap } : { vertical: gap },
			),
			decoration: isHovered
				? new BoxDecoration({
						border: Border.all({
							color: 'rgba(255,255,255,0.35)',
							width: 1,
						}),
						boxShadow: [
							new BoxShadow({
								color: 'rgba(0,0,0,0.18)',
								blurRadius: 10,
							}),
						],
					})
				: undefined,
			child: isVertical
				? Column({
						crossAxisAlignment: CrossAxisAlignment.center,
						children: sections,
					})
				: Row({
						crossAxisAlignment: CrossAxisAlignment.center,
						children: sections,
					}),
		}),
	});
}
