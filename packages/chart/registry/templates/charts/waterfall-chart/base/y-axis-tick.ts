import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function YAxisTick(...args: Parameters<WaterfallChartCustom['yAxisTick']>) {
	return Cartesian.YAxisTick(args[0]);
}
