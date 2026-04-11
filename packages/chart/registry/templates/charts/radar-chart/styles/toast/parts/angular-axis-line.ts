import {
	CustomPaint,
	Path,
	Offset,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { ToastRadarChartConfig } from "../config";

export function toastAngularAxisLine(
	...[{ axisCount }, ctx]: Parameters<RadarChartCustom<ToastRadarChartConfig>["angularLine"]>
): Widget {
	const { radar: radarConfig } = ctx.config;

	return CustomPaint({
		painter: {
			svg: {
				createDefaultSvgEl: (context) => ({
					axisLines: context.createSvgEl("path"),
				}),
					paint: ({ axisLines }, size) => {
						const cx = size.width / 2;
						const cy = size.height / 2;
						const maxRadius = Math.min(cx, cy);

						const axisPath = createPolygonPath(cx, cy, maxRadius, axisCount);
						axisLines.setAttribute("d", axisPath.getD());
						axisLines.setAttribute("fill", "none");
						axisLines.setAttribute("stroke", radarConfig.gridColor);
						axisLines.setAttribute("stroke-width", String(radarConfig.gridWidth));
					},
				},
				canvas: {
				paint: (context, size) => {
					const cx = size.width / 2;
						const cy = size.height / 2;
						const maxRadius = Math.min(cx, cy);
						const canvas = context.canvas;

						const axisPath = createPolygonPath(cx, cy, maxRadius, axisCount);
						canvas.strokeStyle = radarConfig.gridColor;
						canvas.lineWidth = radarConfig.gridWidth;
						canvas.stroke(axisPath.toCanvasPath());
					},
				},
		},
	});
}

function createPolygonPath(
	cx: number,
	cy: number,
	maxRadius: number,
	axisCount: number,
): Path {
	const path = new Path();
	if (axisCount <= 0) return path;
	const angleStep = (2 * Math.PI) / axisCount;
	const startAngle = -Math.PI / 2;

	for (let i = 0; i <= axisCount; i++) {
		const index = i % axisCount;
		const angle = startAngle + index * angleStep;
		const x = cx + maxRadius * Math.cos(angle);
		const y = cy + maxRadius * Math.sin(angle);
		if (i === 0) {
			path.moveTo(new Offset({ x, y }));
		} else {
			path.lineTo(new Offset({ x, y }));
		}
	}
	return path;
}
