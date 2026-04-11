import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function YAxisLabel(...args: Parameters<BoxPlotChartCustom['yAxisLabel']>) {
	return Cartesian.YAxisLabel(args[0]);
}
