import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function YAxisTick(...args: Parameters<WaterfallChartCustom['yAxisTick']>) {
	return Cartesian.YAxisTick(args[0]);
}
