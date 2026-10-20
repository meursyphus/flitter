import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function XAxisTick(...args: Parameters<WaterfallChartCustom['xAxisTick']>) {
	return Cartesian.XAxisTick(args[0]);
}
