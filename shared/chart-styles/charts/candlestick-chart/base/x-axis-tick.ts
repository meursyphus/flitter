import type { CandlestickChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function XAxisTick(...args: Parameters<CandlestickChartCustom['xAxisTick']>) {
	return Cartesian.XAxisTick(args[0]);
}
