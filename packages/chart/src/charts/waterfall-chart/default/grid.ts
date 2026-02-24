import * as Cartesian from '@shared/cartesian/index';
import { WaterfallChartCustom } from '../types';

export function Grid(
	...[{ xLine, yLine }, { data, scale }]: Parameters<WaterfallChartCustom['grid']>
) {
	const labelCount = data.labels.length;
	const valueCount = (scale.max - scale.min) / scale.step;

	return Cartesian.Grid({
		xLine,
		yLine,
		x: labelCount,
		y: valueCount
	});
}
