import {
	Container,
	EdgeInsets,
	BoxDecoration,
	Border,
	BoxShadow,
	ZIndex,
	type Widget,
} from "flitter-core";
import type { HeatmapContext } from "@headless/heatmap-chart/types";
import type { ToastHeatmapChartConfig } from "../config";

export function interpolateColor(
	colorRange: [string, string, string],
	t: number,
): string {
	const clamp = Math.max(0, Math.min(1, t));
	const hex = (c: string) => {
		const h = c.replace("#", "");
		return [
			parseInt(h.slice(0, 2), 16),
			parseInt(h.slice(2, 4), 16),
			parseInt(h.slice(4, 6), 16),
		];
	};
	const [r0, g0, b0] = hex(colorRange[0]);
	const [r1, g1, b1] = hex(colorRange[1]);
	const [r2, g2, b2] = hex(colorRange[2]);

	let r: number, g: number, b: number;
	if (clamp <= 0.5) {
		const local = clamp * 2;
		r = r0 + (r1 - r0) * local;
		g = g0 + (g1 - g0) * local;
		b = b0 + (b1 - b0) * local;
	} else {
		const local = (clamp - 0.5) * 2;
		r = r1 + (r2 - r1) * local;
		g = g1 + (g2 - g1) * local;
		b = b1 + (b2 - b1) * local;
	}

	const toHex = (n: number) =>
		Math.round(n).toString(16).padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function toastSegment(
	{ value, isHovered }: { value: number; xIndex: number; yIndex: number; isHovered: boolean },
	context: HeatmapContext<ToastHeatmapChartConfig>,
): Widget {
	const { heatmap: heatmapConfig } = context.config;
	const { min, max } = context.scale;
	const range = max - min;
	const t = range === 0 ? 0.5 : (value - min) / range;
	const color = interpolateColor(heatmapConfig.colorRange, t);

	const decoration = isHovered
		? new BoxDecoration({
			color,
			border: Border.all({ color: "white", width: 4, strokeAlign: 1 }),
			boxShadow: [
				new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 }),
			],
		})
		: new BoxDecoration({ color });

	const segmentWidget = ZIndex({
		zIndex: isHovered ? 1 : 0,
		child: Container({
			margin: EdgeInsets.all(heatmapConfig.segment.gap),
			decoration,
		}),
	});

	return segmentWidget;
}
