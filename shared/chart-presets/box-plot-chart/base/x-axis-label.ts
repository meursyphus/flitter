import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function XAxisLabel(...args: Parameters<BoxPlotChartCustom['xAxisLabel']>) {
	return Cartesian.XAxisLabel(args[0]);
}
