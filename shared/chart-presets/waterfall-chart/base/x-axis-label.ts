import type { WaterfallChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function XAxisLabel(...args: Parameters<WaterfallChartCustom['xAxisLabel']>) {
	return Cartesian.XAxisLabel(args[0]);
}
