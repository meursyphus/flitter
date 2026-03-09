import type { CandlestickChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function YAxisLabel(...args: Parameters<CandlestickChartCustom['yAxisLabel']>) {
	return Cartesian.YAxisLabel(args[0]);
}
