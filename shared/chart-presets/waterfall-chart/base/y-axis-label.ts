import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function YAxisLabel(...args: Parameters<WaterfallChartCustom['yAxisLabel']>) {
	return Cartesian.YAxisLabel(args[0]);
}
