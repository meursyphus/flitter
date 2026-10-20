import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function YAxis(...args: Parameters<WaterfallChartCustom['yAxis']>) {
	return Cartesian.YAxis(args[0], { type: 'value' });
}
