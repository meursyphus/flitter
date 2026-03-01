import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function Layout(...[args]: Parameters<WaterfallChartCustom['layout']>) {
	return Cartesian.Layout(args);
}
