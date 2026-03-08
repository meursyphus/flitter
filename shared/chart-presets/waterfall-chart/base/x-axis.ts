import type { WaterfallChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function XAxis(...args: Parameters<WaterfallChartCustom['xAxis']>) {
	return Cartesian.XAxis(args[0], { type: 'label' });
}
