import { WaterfallChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function GridYLine(..._: Parameters<WaterfallChartCustom['gridYLine']>) {
	return Cartesian.GridYLine();
}
