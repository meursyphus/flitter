import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function YAxis(...args: Parameters<WaterfallChartCustom['yAxis']>) {
	return Cartesian.YAxis(args[0], { type: 'value' });
}
