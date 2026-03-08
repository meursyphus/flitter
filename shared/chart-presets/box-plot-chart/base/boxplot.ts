import type { BoxPlotChartCustom } from '../types';
import {
	BoxDecoration,
	Border,
	BoxShadow,
	Container,
	Column,
	CrossAxisAlignment,
	Flexible,
	SizedBox,
} from 'flitter-core';
import { HoverTooltip } from '../../_flitter/shared/interaction/hover-tooltip';
import { agTooltipContent, defaultAgCartesianBaseConfig } from '../../ag-base/index';

export function BoxPlot(
	...[{ dataPoint, legend, label, datasetIndex }, { scale }]: Parameters<BoxPlotChartCustom['boxPlot']>
) {
	if (scale == null) return SizedBox.shrink();
	const total = scale.max - scale.min;
	const boxColor =
		defaultAgCartesianBaseConfig.colors.fills[
			datasetIndex % defaultAgCartesianBaseConfig.colors.fills.length
		];
	const whiskerColor = '#333';
	const medianColor = '#E74C3C';

	const minRatio = (dataPoint.min - scale.min) / total;
	const q1Ratio = (dataPoint.q1 - scale.min) / total;
	const medianRatio = (dataPoint.median - scale.min) / total;
	const q3Ratio = (dataPoint.q3 - scale.min) / total;
	const maxRatio = (dataPoint.max - scale.min) / total;

	const boxWidth = 20;
	const whiskerWidth = 12;

	// Build from bottom to top using flex ratios
	// Regions: [0..min] [min..q1] [q1..median] [median..q3] [q3..max] [max..1]
	const belowMin = minRatio;
	const minToQ1 = q1Ratio - minRatio;
	const q1ToMedian = medianRatio - q1Ratio;
	const medianToQ3 = q3Ratio - medianRatio;
	const q3ToMax = maxRatio - q3Ratio;
	const aboveMax = 1 - maxRatio;

	return new HoverTooltip({
		position: 'topCenter',
		tooltip: agTooltipContent({
			label,
			items: [
				{ legend: `${legend} min`, color: whiskerColor, value: dataPoint.min },
				{ legend: `${legend} q1`, color: boxColor, value: dataPoint.q1 },
				{ legend: `${legend} median`, color: medianColor, value: dataPoint.median },
				{ legend: `${legend} q3`, color: boxColor, value: dataPoint.q3 },
				{ legend: `${legend} max`, color: whiskerColor, value: dataPoint.max },
			],
			config: defaultAgCartesianBaseConfig,
		}),
		renderChild: (hovered) =>
			Container({
				width: boxWidth + 8,
				height: Infinity,
				decoration: hovered
					? new BoxDecoration({
							border: Border.all({ color: 'rgba(255,255,255,0.35)', width: 1 }),
							boxShadow: [new BoxShadow({ color: 'rgba(0,0,0,0.18)', blurRadius: 10 })],
						})
					: undefined,
				child: Column({
					crossAxisAlignment: CrossAxisAlignment.center,
					children: [
						...(aboveMax > 0
							? [Flexible({ flex: aboveMax, child: SizedBox({ width: 1 }) })]
							: []),
						Container({ width: whiskerWidth, height: 1, color: whiskerColor }),
						...(q3ToMax > 0
							? [Flexible({
									flex: q3ToMax,
									child: Container({ width: hovered ? 2 : 1, color: whiskerColor, height: Infinity }),
								})]
							: []),
						...(medianToQ3 > 0
							? [Flexible({
									flex: medianToQ3,
									child: Container({ width: boxWidth, color: boxColor, height: Infinity }),
								})]
							: []),
						Container({ width: boxWidth, height: hovered ? 3 : 2, color: medianColor }),
						...(q1ToMedian > 0
							? [Flexible({
									flex: q1ToMedian,
									child: Container({ width: boxWidth, color: boxColor, height: Infinity }),
								})]
							: []),
						...(minToQ1 > 0
							? [Flexible({
									flex: minToQ1,
									child: Container({ width: hovered ? 2 : 1, color: whiskerColor, height: Infinity }),
								})]
							: []),
						Container({ width: whiskerWidth, height: 1, color: whiskerColor }),
						...(belowMin > 0
							? [Flexible({ flex: belowMin, child: SizedBox({ width: 1 }) })]
							: []),
					],
				}),
			}),
	});
}
