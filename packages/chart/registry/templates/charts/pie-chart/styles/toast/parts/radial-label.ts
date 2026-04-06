import {
	Column,
	CrossAxisAlignment,
	MainAxisSize,
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
	const { radial, radialLabel, font } = ctx.config;

	if (!radial.visible) return SizedBox.shrink();

	const isRightSide = Math.cos(args.angle) >= 0;
	const subtitleFontSize = Math.max(9, Math.round(radialLabel.fontSize * 0.68));

	return Column({
		mainAxisSize: MainAxisSize.min,
		crossAxisAlignment: isRightSide
			? CrossAxisAlignment.start
			: CrossAxisAlignment.end,
		children: [
			Text(radialLabel.formatter(args), {
				textAlign: isRightSide ? TextAlign.left : TextAlign.right,
				style: new TextStyle({
					fontFamily: radialLabel.fontFamily ?? font.family,
					fontSize: radialLabel.fontSize,
					fontWeight: radialLabel.fontWeight,
					color: radialLabel.fontColor,
				}),
			}),
			Text(args.name, {
				textAlign: isRightSide ? TextAlign.left : TextAlign.right,
				style: new TextStyle({
					fontFamily: radialLabel.fontFamily ?? font.family,
					fontSize: subtitleFontSize,
					color: radialLabel.nameColor,
				}),
			}),
		],
	});
}
