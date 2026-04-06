import {
	SizedBox,
	Text,
	TextAlign,
	TextStyle,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "@headless/pie-chart/types";
import type { ToastPieChartConfig } from "../config";

export function toastRadialLabel(
	...[args, ctx]: Parameters<PieChartCustom<ToastPieChartConfig>["radialLabel"]>
): Widget {
	const { radial, radialLabel, font, colors } = ctx.config;

	if (!radial.visible) return SizedBox.shrink();

	const isRightSide = Math.cos(args.angle) >= 0;
	const colorIndex = ctx.legends.indexOf(args.name);
	const seriesColor =
		colors[(colorIndex >= 0 ? colorIndex : args.index) % colors.length]
		?? radialLabel.fontColor;

	return Text(radialLabel.formatter(args), {
		textAlign: isRightSide ? TextAlign.left : TextAlign.right,
		style: new TextStyle({
			fontFamily: radialLabel.fontFamily ?? font.family,
			fontSize: radialLabel.fontSize,
			fontWeight: radialLabel.fontWeight,
			color: seriesColor,
		}),
	});
}
