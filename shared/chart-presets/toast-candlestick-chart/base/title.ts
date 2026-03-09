import type { CandlestickChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function Title(...args: Parameters<CandlestickChartCustom['title']>) {
	return Cartesian.Title();
}
