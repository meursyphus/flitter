import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function XAxisLine(...args: Parameters<BoxPlotChartCustom['xAxisLine']>) {
	return Cartesian.XAxisLine();
}
