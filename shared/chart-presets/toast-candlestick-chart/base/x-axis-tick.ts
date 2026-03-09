import type { CandlestickChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function XAxisTick(...args: Parameters<CandlestickChartCustom['xAxisTick']>) {
	return Cartesian.XAxisTick(args[0]);
}
