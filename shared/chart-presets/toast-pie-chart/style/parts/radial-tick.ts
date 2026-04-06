import {
	Container,
	SizedBox,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "flitter-ui/chart";
import type { ToastPieChartConfig } from "../config";

export function toastRadialTick(
	...[args, ctx]: Parameters<PieChartCustom<ToastPieChartConfig>["radialTick"]>
): Widget {
	const { radial, radialTick, colors } = ctx.config;

	if (!radial.visible || radialTick.length <= 0) {
		return SizedBox.shrink();
	}

	const colorIndex = ctx.legends.indexOf(args.name);
	const seriesColor =
		colors[(colorIndex >= 0 ? colorIndex : args.index) % colors.length]
		?? radialTick.color;

	return SizedBox({
		width: radialTick.strokeWidth,
		height: radialTick.length,
		child: Container({
			color: seriesColor,
		}),
	});
}
