import type { BoxPlotChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function Title(...args: Parameters<BoxPlotChartCustom['title']>) {
	return Cartesian.Title(args[0]);
}
