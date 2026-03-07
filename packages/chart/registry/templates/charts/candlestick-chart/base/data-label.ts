import type { CandlestickChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function DataLabel(...args: Parameters<CandlestickChartCustom['dataLabel']>) {
	return Cartesian.DataLabel(args[0]);
}
