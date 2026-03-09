import type { CandlestickChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function XAxisLabel(...args: Parameters<CandlestickChartCustom['xAxisLabel']>) {
	return Cartesian.XAxisLabel(args[0]);
}
