import { ZIndex, type Widget } from "flitter-core";
import type { PieChartCustom } from "flitter-ui/chart";
import type { ToastPieChartConfig } from "../config";
import { baseSlice } from "../../base/slice";

export function toastSlice(
	...[{ index, name, sweepAngle }, ctx]: Parameters<PieChartCustom<ToastPieChartConfig>["slice"]>
): Widget {
	const { colors, pie: pieConfig } = ctx.config;
	const colorIndex = ctx.legends.indexOf(name);
	const color = colors[(colorIndex >= 0 ? colorIndex : index) % colors.length];
	const hovered = ctx.isSliceHovered(index);

	const slice = baseSlice({
		index,
		sweepAngle,
		innerRadiusRatio: pieConfig.innerRadiusRatio,
		ctx,
		fill: color,
		strokeColor: hovered ? "white" : pieConfig.strokeColor,
		strokeWidth: hovered ? 4 : pieConfig.strokeWidth,
		svgFilter: hovered ? "drop-shadow(0 0 8px rgba(0,0,0,0.3))" : undefined,
	});

	return ZIndex({
		zIndex: hovered ? 9999 : 0,
		child: slice,
	});
}
