import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function GridXLine(...args: Parameters<BoxPlotChartCustom['gridXLine']>) {
	return Cartesian.GridXLine();
}
