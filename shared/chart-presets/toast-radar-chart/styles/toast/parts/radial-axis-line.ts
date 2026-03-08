import {
	CustomPaint,
	Path,
	Offset,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "../../../../_flitter/headless/radar-chart";
import type { ToastRadarChartConfig } from "../config";

export function toastRadialAxisLine(
	...[{ levels, axisCount }, ctx]: Parameters<RadarChartCustom<ToastRadarChartConfig>["radialAxisLine"]>
): Widget {
	const { radar: radarConfig } = ctx.config;

	return CustomPaint({
		painter: {
			svg: {
				createDefaultSvgEl: (context) => ({
					gridLines: context.createSvgEl("path"),
				}),
				paint: ({ gridLines }, size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const maxRadius = Math.min(cx, cy);

					const gridPath = createGridPath(cx, cy, maxRadius, levels, axisCount);
					gridLines.setAttribute("d", gridPath.getD());
					gridLines.setAttribute("fill", "none");
					gridLines.setAttribute("stroke", radarConfig.gridColor);
					gridLines.setAttribute("stroke-width", String(radarConfig.gridWidth));
				},
			},
			canvas: {
				paint: (context, size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const maxRadius = Math.min(cx, cy);
					const canvas = context.canvas;

					const gridPath = createGridPath(cx, cy, maxRadius, levels, axisCount);
					canvas.strokeStyle = radarConfig.gridColor;
					canvas.lineWidth = radarConfig.gridWidth;
					canvas.stroke(gridPath.toCanvasPath());
				},
			},
		},
	});
}

function createGridPath(
	cx: number,
	cy: number,
	maxRadius: number,
	levels: number,
	axisCount: number,
): Path {
	const path = new Path();
	const angleStep = (2 * Math.PI) / axisCount;
	const startAngle = -Math.PI / 2;

	for (let level = 1; level <= levels; level++) {
		const radius = (maxRadius * level) / levels;
		for (let i = 0; i <= axisCount; i++) {
			const idx = i % axisCount;
			const angle = startAngle + idx * angleStep;
			const x = cx + radius * Math.cos(angle);
			const y = cy + radius * Math.sin(angle);
			if (i === 0) {
				path.moveTo(new Offset({ x, y }));
			} else {
				path.lineTo(new Offset({ x, y }));
			}
		}
	}
	return path;
}
