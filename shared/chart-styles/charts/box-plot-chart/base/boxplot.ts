import type { BoxPlotChartCustom } from '../types';
import {
	Alignment,
	Container,
	Stack,
	Positioned,
	FractionallySizedBox,
	Column,
	MainAxisAlignment,
	CrossAxisAlignment,
	Flexible,
	Flex,
	Axis,
	Expanded,
	SizedBox,
} from 'flitter-core';

export function BoxPlot(
	...[{ dataPoint }, { scale }]: Parameters<BoxPlotChartCustom['boxPlot']>
) {
	if (scale == null) return SizedBox.shrink();
	const total = scale.max - scale.min;
	const boxColor = '#4A90D9';
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

	return Container({
		width: boxWidth + 8,
		height: Infinity,
		child: Column({
			crossAxisAlignment: CrossAxisAlignment.center,
			children: [
				// Space above max
				...(aboveMax > 0
					? [Flexible({ flex: aboveMax, child: SizedBox({ width: 1 }) })]
					: []),
				// Max whisker cap
				Container({ width: whiskerWidth, height: 1, color: whiskerColor }),
				// Upper whisker (q3 to max)
				...(q3ToMax > 0
					? [Flexible({
							flex: q3ToMax,
							child: Container({ width: 1, color: whiskerColor, height: Infinity }),
						})]
					: []),
				// IQR box upper half (median to q3)
				...(medianToQ3 > 0
					? [Flexible({
							flex: medianToQ3,
							child: Container({ width: boxWidth, color: boxColor, height: Infinity }),
						})]
					: []),
				// Median line
				Container({ width: boxWidth, height: 2, color: medianColor }),
				// IQR box lower half (q1 to median)
				...(q1ToMedian > 0
					? [Flexible({
							flex: q1ToMedian,
							child: Container({ width: boxWidth, color: boxColor, height: Infinity }),
						})]
					: []),
				// Lower whisker (min to q1)
				...(minToQ1 > 0
					? [Flexible({
							flex: minToQ1,
							child: Container({ width: 1, color: whiskerColor, height: Infinity }),
						})]
					: []),
				// Min whisker cap
				Container({ width: whiskerWidth, height: 1, color: whiskerColor }),
				// Space below min
				...(belowMin > 0
					? [Flexible({ flex: belowMin, child: SizedBox({ width: 1 }) })]
					: []),
			],
		}),
	});
}
