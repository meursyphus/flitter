import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function Title(...args: Parameters<WaterfallChartCustom['title']>) {
	return Cartesian.Title();
}
