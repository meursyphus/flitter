import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function XAxisLine(...args: Parameters<BoxPlotChartCustom['xAxisLine']>) {
	return Cartesian.XAxisLine();
}
