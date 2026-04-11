import type { WaterfallChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function Plot(...args: Parameters<WaterfallChartCustom['plot']>) {
	return Cartesian.Plot(args[0]);
}
