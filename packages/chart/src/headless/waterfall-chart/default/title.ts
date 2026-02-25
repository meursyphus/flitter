import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function Title(...args: Parameters<WaterfallChartCustom['title']>) {
	return Cartesian.Title(args[0]);
}
