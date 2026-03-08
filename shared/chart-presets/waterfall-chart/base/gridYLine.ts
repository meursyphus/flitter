import { WaterfallChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function GridYLine(..._: Parameters<WaterfallChartCustom['gridYLine']>) {
	return Cartesian.GridYLine();
}
