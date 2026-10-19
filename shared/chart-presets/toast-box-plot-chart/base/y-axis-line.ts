import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function YAxisLine(...args: Parameters<BoxPlotChartCustom['yAxisLine']>) {
	return Cartesian.YAxisLine();
}
