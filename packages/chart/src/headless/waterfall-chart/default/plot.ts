import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function Plot(...args: Parameters<WaterfallChartCustom['plot']>) {
	return Cartesian.Plot(args[0]);
}
