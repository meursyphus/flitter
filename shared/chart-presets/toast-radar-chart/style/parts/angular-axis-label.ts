import {
	Text,
	TextStyle,
	TextAlign,
	type Widget,
} from "flitter-ui";
import type { RadarChartCustom } from "flitter-ui/chart";
import type { ToastRadarChartConfig } from "../config";

export function toastAngularAxisLabel(
	...[{ label, angle }, ctx]: Parameters<RadarChartCustom<ToastRadarChartConfig>["angularAxisLabel"]>
): Widget {
	const { font, axis } = ctx.config;

	const cos = Math.cos(angle);

	let textAlign = TextAlign.center;
	if (cos > 0.1) {
		textAlign = TextAlign.left;
	} else if (cos < -0.1) {
		textAlign = TextAlign.right;
	}

	return Text(label, {
		textAlign,
		softWrap: false,
		style: new TextStyle({
			fontFamily: font.family,
			fontSize: axis.label.fontSize + 2,
			color: axis.label.color,
		}),
	});
}
