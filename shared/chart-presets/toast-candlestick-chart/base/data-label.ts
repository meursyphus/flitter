import type { CandlestickChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function DataLabel(...args: Parameters<CandlestickChartCustom['dataLabel']>) {
	return Cartesian.DataLabel(args[0]);
}
