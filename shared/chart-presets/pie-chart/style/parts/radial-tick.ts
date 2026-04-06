import {
	Container,
	SizedBox,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "flitter-ui/chart";
import type { AgPieChartConfig } from "../config";

export function agRadialTick(
	...[args, ctx]: Parameters<PieChartCustom<AgPieChartConfig>["radialTick"]>
): Widget {
	const { radial, radialTick, colors } = ctx.config;

	if (!radial.visible || radialTick.length <= 0) {
		return SizedBox.shrink();
	}

	const colorIndex = ctx.legends.indexOf(args.name);
	const seriesColor =
		colors.fills[(colorIndex >= 0 ? colorIndex : args.index) % colors.fills.length]
		?? radialTick.color;

	return SizedBox({
		width: radialTick.strokeWidth,
		height: radialTick.length,
		child: Container({
			color: seriesColor,
		}),
	});
}
