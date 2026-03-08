import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function XAxisTick(...args: Parameters<WaterfallChartCustom['xAxisTick']>) {
	return Cartesian.XAxisTick(args[0]);
}
