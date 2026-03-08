import type { WaterfallChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function Layout(...[args]: Parameters<WaterfallChartCustom['layout']>) {
	return Cartesian.Layout(args);
}
