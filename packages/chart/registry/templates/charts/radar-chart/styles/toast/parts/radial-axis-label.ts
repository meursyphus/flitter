import {
	Text,
	TextStyle,
	type Widget,
	SizedBox,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { ToastRadarChartConfig } from "../config";

export function toastRadialAxisLabel(
	...[{ value, index }, ctx]: Parameters<RadarChartCustom<ToastRadarChartConfig>["radialAxisLabel"]>
): Widget {
	if (index === 0) return SizedBox.shrink();

	const { font, axis } = ctx.config;

	return Text(String(value), {
		style: new TextStyle({
			fontFamily: font.family,
			fontSize: axis.label.fontSize - 2,
			color: axis.label.color,
		}),
	});
}
