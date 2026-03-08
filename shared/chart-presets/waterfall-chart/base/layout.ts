import type { WaterfallChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function Layout(...[args]: Parameters<WaterfallChartCustom['layout']>) {
	return Cartesian.Layout(args);
}
