import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function XAxisLabel(...args: Parameters<WaterfallChartCustom['xAxisLabel']>) {
	return Cartesian.XAxisLabel(args[0]);
}
