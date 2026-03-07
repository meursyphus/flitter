import type { CandlestickChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function Layout(...[{ title, legends, plot }]: Parameters<CandlestickChartCustom['layout']>) {
	return Cartesian.Layout({ title, legends, plot });
}
