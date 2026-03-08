import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function XAxisLabel(...args: Parameters<WaterfallChartCustom['xAxisLabel']>) {
	return Cartesian.XAxisLabel(args[0]);
}
