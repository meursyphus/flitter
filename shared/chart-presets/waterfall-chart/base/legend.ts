import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function Legend(...args: Parameters<WaterfallChartCustom['legend']>) {
	return Cartesian.Legend(args[0]);
}
