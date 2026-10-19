import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function YAxisTick(...args: Parameters<WaterfallChartCustom['yAxisTick']>) {
	return Cartesian.YAxisTick(args[0]);
}
