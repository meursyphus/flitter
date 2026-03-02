import {
	CustomPaint,
	Path,
	Offset,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { ToastRadarChartConfig } from "../config";

export function toastGrid(
	...[{ levels, axisCount }, ctx]: Parameters<RadarChartCustom<ToastRadarChartConfig>["grid"]>
): Widget {
	const { radar: radarConfig } = ctx.config;

	return CustomPaint({
		painter: {
			svg: {
				createDefaultSvgEl: (context) => ({
					gridLines: context.createSvgEl("path"),
					axisLines: context.createSvgEl("path"),
				}),
				paint: ({ gridLines, axisLines }, size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const maxRadius = Math.min(cx, cy);

					const gridPath = createGridPath(cx, cy, maxRadius, levels, axisCount);
					gridLines.setAttribute("d", gridPath.getD());
					gridLines.setAttribute("fill", "none");
					gridLines.setAttribute("stroke", radarConfig.gridColor);
					gridLines.setAttribute("stroke-width", String(radarConfig.gridWidth));

					const axisPath = createAxisPath(cx, cy, maxRadius, axisCount);
					axisLines.setAttribute("d", axisPath.getD());
					axisLines.setAttribute("fill", "none");
					axisLines.setAttribute("stroke", radarConfig.axisColor);
					axisLines.setAttribute("stroke-width", String(radarConfig.axisWidth));
				},
			},
			canvas: {
				paint: (context, size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const maxRadius = Math.min(cx, cy);
					const canvas = context.canvas;

					// Grid polygons
					const gridPath = createGridPath(cx, cy, maxRadius, levels, axisCount);
					canvas.strokeStyle = radarConfig.gridColor;
					canvas.lineWidth = radarConfig.gridWidth;
					canvas.stroke(gridPath.toCanvasPath());

					// Axis lines
					const axisPath = createAxisPath(cx, cy, maxRadius, axisCount);
					canvas.strokeStyle = radarConfig.axisColor;
					canvas.lineWidth = radarConfig.axisWidth;
					canvas.stroke(axisPath.toCanvasPath());
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

function createAxisPath(
	cx: number,
	cy: number,
	maxRadius: number,
	axisCount: number,
): Path {
	const path = new Path();
	const angleStep = (2 * Math.PI) / axisCount;
	const startAngle = -Math.PI / 2;

	for (let i = 0; i < axisCount; i++) {
		const angle = startAngle + i * angleStep;
		const x = cx + maxRadius * Math.cos(angle);
		const y = cy + maxRadius * Math.sin(angle);
		path.moveTo(new Offset({ x: cx, y: cy }));
		path.lineTo(new Offset({ x, y }));
	}
	return path;
}
