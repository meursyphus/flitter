import type { CandlestickChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function Layout(...[{ title, legends, plot }]: Parameters<CandlestickChartCustom['layout']>) {
	return Cartesian.Layout({ title, legends, plot });
}
