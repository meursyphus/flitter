import { WaterfallChartCustom } from '../types';
import * as Cartesian from '../../_flitter/shared/cartesian/index';

export function GridXLine(..._: Parameters<WaterfallChartCustom['gridXLine']>) {
	return Cartesian.GridXLine();
}
