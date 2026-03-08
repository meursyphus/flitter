import type { CandlestickChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function YAxisLabel(...args: Parameters<CandlestickChartCustom['yAxisLabel']>) {
	return Cartesian.YAxisLabel(args[0]);
}
