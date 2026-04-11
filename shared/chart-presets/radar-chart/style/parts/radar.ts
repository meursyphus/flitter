import {
	CustomPaint,
	Offset,
	Path,
	type Widget,
} from "flitter-ui";
import type { RadarChartCustom } from "flitter-ui/chart";
import type { AgRadarChartConfig } from "../config";

export function agRadar(
	...[{ legend, index, vertices, isHovered }, ctx]: Parameters<RadarChartCustom<AgRadarChartConfig>["radar"]>
): Widget {
	const { colors, radar: radarConfig } = ctx.config;
	const colorIndex = ctx.legends.indexOf(legend);
	const fillColor = colors.fills[(colorIndex >= 0 ? colorIndex : index) % colors.fills.length];
	const strokeColor = colors.strokes[(colorIndex >= 0 ? colorIndex : index) % colors.strokes.length];
	const hoveredRadar = ctx.hoveredRadar;
	const hasActiveHover = hoveredRadar != null;
	const fillOpacity = hasActiveHover
		? isHovered
			? radarConfig.fillOpacity
			: Math.max(0.08, radarConfig.fillOpacity * 0.35)
		: radarConfig.fillOpacity;
	const strokeOpacity = hasActiveHover
		? isHovered
			? 1
			: 0.3
		: 1;

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
					fill.setAttribute("fill", fillColor);
					fill.setAttribute("fill-opacity", String(fillOpacity));
					fill.setAttribute("stroke", "none");

					stroke.setAttribute("d", d);
					stroke.setAttribute("fill", "none");
					stroke.setAttribute("stroke", strokeColor);
					stroke.setAttribute("stroke-width", String(radarConfig.strokeWidth));
					stroke.setAttribute("stroke-opacity", String(strokeOpacity));
				},
			},
			canvas: {
				paint: (context, size) => {
					const path = createDatasetPath(vertices, size.width, size.height);
					const canvasPath = path.toCanvasPath();
					const canvas = context.canvas;

					canvas.globalAlpha = fillOpacity;
					canvas.fillStyle = fillColor;
					canvas.fill(canvasPath);
					canvas.globalAlpha = strokeOpacity;
					canvas.strokeStyle = strokeColor;
					canvas.lineWidth = radarConfig.strokeWidth;
					canvas.stroke(canvasPath);
					canvas.globalAlpha = 1;
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

	for (let i = 0; i <= vertices.length; i += 1) {
		const vertex = vertices[i % vertices.length];
		const x = vertex.nx * width;
		const y = vertex.ny * height;
		if (i === 0) {
			path.moveTo(new Offset({ x, y }));
		} else {
			path.lineTo(new Offset({ x, y }));
		}
	}

	path.close();
	return path;
}
