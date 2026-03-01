import type { BoxPlotChartCustom } from '../types';
import {
	Container,
	BoxDecoration,
	Border,
	BorderRadius,
	Radius,
} from 'flitter-core';

export function Outlier(
	...[{ value }]: Parameters<BoxPlotChartCustom['outlier']>
) {
	return Container({
		width: 6,
		height: 6,
		decoration: new BoxDecoration({
			border: Border.all({ color: '#E74C3C', width: 1 }),
			borderRadius: BorderRadius.all(Radius.circular(3)),
		}),
	});
}
