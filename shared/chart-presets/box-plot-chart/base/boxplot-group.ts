import type { BoxPlotChartCustom } from '../types';
import {
	Axis,
	Container,
	Flex,
	Flexible,
	MainAxisAlignment,
	SizedBox,
} from 'flitter-ui';

export function BoxPlotGroup(
	...[{ boxPlots, dataPoints, index }, ctx]: Parameters<BoxPlotChartCustom['boxPlotGroup']>
) {
	const { scale, direction } = ctx;
	if (scale == null) return SizedBox.shrink();

	const isVertical = direction === 'vertical';
	const total = scale.max - scale.min || 1;

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
				const outlierValues = dp.outliers ?? [];
				const outliersWithRatio = outliers.map((widget, i) => ({
					widget,
					ratio: (outlierValues[i] - scale.min) / total,
				}));

				const legend = ctx.data.datasets[datasetIndex].legend;
				const label = ctx.data.labels[index];
				const h = ctx.hoveredBoxPlot;
				const isHovered = h != null && h.index === index && h.legend === legend && h.kind === "boxPlot";

				return Flexible({
					flex: 1,
					child: ctx.custom.boxPlotBox(
						{ boxPlot, outliers: outliersWithRatio, minRatio, maxRatio, index, datasetIndex, label, legend, isHovered, dataPoint: dataPoints[datasetIndex] },
						ctx,
					),
				});
			}),
		}),
	});
}
