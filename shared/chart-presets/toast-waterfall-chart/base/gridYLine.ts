import { WaterfallChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function GridYLine(..._: Parameters<WaterfallChartCustom['gridYLine']>) {
	return Cartesian.GridYLine();
}
