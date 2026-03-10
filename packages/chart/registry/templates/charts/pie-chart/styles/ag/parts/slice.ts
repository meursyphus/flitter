import { Opacity, type Widget } from "flitter-core";
import type { PieChartCustom } from "@headless/pie-chart/types";
import type { AgPieChartConfig } from "../config";
import { baseSlice } from "../../../base/slice";

export function agSlice(
	...[{ index, name, sweepAngle }, ctx]: Parameters<PieChartCustom<AgPieChartConfig>["slice"]>
): Widget {
	const { colors, pie: pieConfig } = ctx.config;
	const colorIndex = ctx.legends.indexOf(name);
	const fill = colors.fills[(colorIndex >= 0 ? colorIndex : index) % colors.fills.length];

	let opacity = 1;
	if (ctx.hoveredIndex != null) {
		opacity = ctx.isSliceHovered(index) ? 1 : 0.35;
	}

	const slice = baseSlice({
		index,
		sweepAngle,
		innerRadiusRatio: pieConfig.innerRadiusRatio,
		ctx,
		fill,
		strokeColor: pieConfig.strokeColor,
		strokeWidth: pieConfig.strokeWidth,
	});

	return Opacity({ opacity, child: slice });
}
