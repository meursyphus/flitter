import type { CandlestickChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function XAxisLabel(...args: Parameters<CandlestickChartCustom['xAxisLabel']>) {
	return Cartesian.XAxisLabel(args[0]);
}
