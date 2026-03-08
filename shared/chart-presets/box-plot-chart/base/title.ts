import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function Title(...args: Parameters<BoxPlotChartCustom['title']>) {
	return Cartesian.Title();
}
