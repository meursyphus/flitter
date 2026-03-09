import type { WaterfallChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function YAxisTick(...args: Parameters<WaterfallChartCustom['yAxisTick']>) {
	return Cartesian.YAxisTick(args[0]);
}
