import type { WaterfallChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function XAxisTick(...args: Parameters<WaterfallChartCustom['xAxisTick']>) {
	return Cartesian.XAxisTick(args[0]);
}
