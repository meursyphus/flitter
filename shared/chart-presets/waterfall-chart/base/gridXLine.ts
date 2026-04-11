import { WaterfallChartCustom } from '../types';
import * as Cartesian from 'flitter-ui/chart';

export function GridXLine(..._: Parameters<WaterfallChartCustom['gridXLine']>) {
	return Cartesian.GridXLine();
}
