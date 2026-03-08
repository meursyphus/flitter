import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function YAxisLine(...args: Parameters<BoxPlotChartCustom['yAxisLine']>) {
	return Cartesian.YAxisLine();
}
