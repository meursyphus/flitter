import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function YAxisLine(...args: Parameters<BoxPlotChartCustom['yAxisLine']>) {
	return Cartesian.YAxisLine();
}
