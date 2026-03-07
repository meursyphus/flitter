import type { CandlestickChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function XAxisLabel(...args: Parameters<CandlestickChartCustom['xAxisLabel']>) {
	return Cartesian.XAxisLabel(args[0]);
}
