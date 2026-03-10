import type { BoxPlotChartCustom } from '../types';
import { Stack, StackFit } from 'flitter-core';

export function BoxPlotBox(
	...[{ boxPlot, outliers }]: Parameters<BoxPlotChartCustom['boxPlotBox']>
) {
	return Stack({
		fit: StackFit.expand,
		clipped: false,
		children: [boxPlot, ...outliers],
	});
}
