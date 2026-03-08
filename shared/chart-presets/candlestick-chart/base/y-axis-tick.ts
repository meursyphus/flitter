import type { CandlestickChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function YAxisTick(...args: Parameters<CandlestickChartCustom['yAxisTick']>) {
	return Cartesian.YAxisTick(args[0]);
}
