import type { CandlestickChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function YAxisTick(...args: Parameters<CandlestickChartCustom['yAxisTick']>) {
	return Cartesian.YAxisTick(args[0]);
}
