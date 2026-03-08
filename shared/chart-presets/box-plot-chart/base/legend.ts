import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function Legend(...args: Parameters<BoxPlotChartCustom['legend']>) {
	return Cartesian.Legend(args[0]);
}
