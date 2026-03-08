import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function Plot(...args: Parameters<WaterfallChartCustom['plot']>) {
	return Cartesian.Plot(args[0]);
}
