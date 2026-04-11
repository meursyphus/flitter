import type { WaterfallChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function Title(...args: Parameters<WaterfallChartCustom['title']>) {
	return Cartesian.Title();
}
