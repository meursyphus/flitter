import { WaterfallChartCustom } from '../types';
import * as Cartesian from '@flitterjs/chart';

export function GridXLine(..._: Parameters<WaterfallChartCustom['gridXLine']>) {
	return Cartesian.GridXLine();
}
