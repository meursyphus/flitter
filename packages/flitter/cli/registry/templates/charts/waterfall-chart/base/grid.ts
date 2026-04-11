import * as Cartesian from "@shared/cartesian/index";
import { WaterfallChartCustom } from "../types";

export function Grid(
	...[{ xLine, yLine }, { items, scale }]: Parameters<WaterfallChartCustom["grid"]>
) {
	if (scale == null) {
		return Cartesian.Grid({ xLine, yLine, x: items.length, y: 0 });
	}
	const labelCount = items.length;
	const valueCount = (scale.max - scale.min) / scale.step;

	return Cartesian.Grid({
		xLine,
		yLine,
		x: labelCount,
		y: valueCount,
	});
}
