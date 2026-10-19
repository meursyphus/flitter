import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function Layout(...[args]: Parameters<WaterfallChartCustom['layout']>) {
	return Cartesian.Layout(args);
}
