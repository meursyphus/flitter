import type { CandlestickChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function Title(...args: Parameters<CandlestickChartCustom['title']>) {
	return Cartesian.Title();
}
