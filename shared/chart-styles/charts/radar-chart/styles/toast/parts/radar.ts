import {
	CustomPaint,
	Path,
	Offset,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { ToastRadarChartConfig } from "../config";

export function toastRadar(
	...[{ legend, index, vertices }, ctx]: Parameters<RadarChartCustom<ToastRadarChartConfig>["radar"]>
): Widget {
	const { colors, radar: radarConfig } = ctx.config;
	const colorIndex = ctx.legends.indexOf(legend);
	const color = colors[(colorIndex >= 0 ? colorIndex : index) % colors.length];

	return CustomPaint({
		painter: {
			svg: {
				createDefaultSvgEl: (context) => ({
					fill: context.createSvgEl("path"),
					stroke: context.createSvgEl("path"),
				}),
				paint: ({ fill, stroke }, size) => {
					const path = createDatasetPath(vertices, size.width, size.height);
					const d = path.getD();

					fill.setAttribute("d", d);
					fill.setAttribute("fill", color);
					fill.setAttribute("fill-opacity", String(radarConfig.fillOpacity));
					fill.setAttribute("stroke", "none");

					stroke.setAttribute("d", d);
					stroke.setAttribute("fill", "none");
					stroke.setAttribute("stroke", color);
					stroke.setAttribute("stroke-width", String(radarConfig.strokeWidth));
				},
			},
			canvas: {
				paint: (context, size) => {
					const path = createDatasetPath(vertices, size.width, size.height);
					const canvasPath = path.toCanvasPath();
					const canvas = context.canvas;

					canvas.globalAlpha = radarConfig.fillOpacity;
					canvas.fillStyle = color;
					canvas.fill(canvasPath);
					canvas.globalAlpha = 1;

					canvas.strokeStyle = color;
					canvas.lineWidth = radarConfig.strokeWidth;
					canvas.stroke(canvasPath);
				},
			},
		},
	});
}

function createDatasetPath(
	vertices: { nx: number; ny: number }[],
	width: number,
	height: number,
): Path {
	const path = new Path();
	if (vertices.length === 0) return path;

	for (let i = 0; i <= vertices.length; i++) {
		const v = vertices[i % vertices.length];
		const x = v.nx * width;
		const y = v.ny * height;
		if (i === 0) {
			path.moveTo(new Offset({ x, y }));
		} else {
			path.lineTo(new Offset({ x, y }));
		}
	}
	path.close();
	return path;
}
