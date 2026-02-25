import { WaterfallChartCustom } from '../types';
import * as Cartesian from '@shared/cartesian/index';

export function GridXLine(..._: Parameters<WaterfallChartCustom['gridXLine']>) {
	return Cartesian.GridXLine();
}
