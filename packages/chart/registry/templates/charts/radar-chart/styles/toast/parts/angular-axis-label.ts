import {
	Align,
	Alignment,
	Text,
	TextStyle,
	TextAlign,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { ToastRadarChartConfig } from "../config";

export function toastAngularAxisLabel(
	...[{ label, angle, nx, ny }, ctx]: Parameters<RadarChartCustom<ToastRadarChartConfig>["angularAxisLabel"]>
): Widget {
	const { font, axis } = ctx.config;

	const cos = Math.cos(angle);
	const sin = Math.sin(angle);

	// Push labels outward from the unit circle edge
	const labelOffset = 0.12;
	const lx = nx + labelOffset * cos;
	const ly = ny + labelOffset * sin;

	// Convert from 0..1 to Alignment's -1..1
	const alignX = lx * 2 - 1;
	const alignY = ly * 2 - 1;

	// Determine text alignment based on horizontal position
	let textAlign = TextAlign.center;
	if (cos > 0.1) {
		textAlign = TextAlign.left;
	} else if (cos < -0.1) {
		textAlign = TextAlign.right;
	}

	return Align({
		alignment: new Alignment({ x: alignX, y: alignY }),
		child: Text(label, {
			textAlign,
			style: new TextStyle({
				fontFamily: font.family,
				fontSize: axis.label.fontSize,
				color: axis.label.color,
			}),
		}),
	});
}
