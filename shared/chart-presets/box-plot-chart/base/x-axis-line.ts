import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function XAxisLine(...args: Parameters<BoxPlotChartCustom['xAxisLine']>) {
	return Cartesian.XAxisLine();
}
