import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function YAxisLabel(...args: Parameters<WaterfallChartCustom['yAxisLabel']>) {
	return Cartesian.YAxisLabel(args[0]);
}
